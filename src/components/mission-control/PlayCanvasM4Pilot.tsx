"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Application, Container, Entity } from "@playcanvas/react";
import { Camera, Light, Render } from "@playcanvas/react/components";
import { useApp, useModel } from "@playcanvas/react/hooks";
import { Color, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO, StandardMaterial, Vec3, type AnimTrack, type Entity as PcEntity } from "playcanvas";
import { m4Mission } from "@/data/missions/m4-silicone";
import { m4RowReference, resolveM4Family, type M4SourceRecord } from "@/lib/m4-evidence";
import { useMissionSession, type MissionSessionState } from "@/lib/mission-session";
import { M4_REVIEW_LAYOUT, m4ReviewSessionPatch, type M4PlayCanvasStage } from "@/lib/m4-playcanvas";

const visualVariants = new Set(["gravifire_corridor_4m.glb", "gravifire_lab_shell_8x8.glb", "gravifire_bulkhead_door.glb", "gravifire_equipment_rack.glb", "gravifire_science_console.glb", "gravifire_analysis_wall.glb"]);
const GENERATED_ROOT = "/assets/game/generated/m1/";
const CHARACTER_ASSET = "/assets/game/character/quaternius-human-astronaut.glb";
const CHARACTER_CLIPS = { IDLE: "CharacterArmature|Idle", WALK: "CharacterArmature|Walk", RUN: "CharacterArmature|Run" } as const;
const family = resolveM4Family();
const records = Object.fromEntries(family.map((record) => [record.run.sourceExperimentId, record])) as Record<string, M4SourceRecord>;
const refs = Object.fromEntries(family.map((record) => [record.run.sourceExperimentId, m4RowReference(record)]));

type ReviewStage = "material" | "ground" | "lowg" | "samples" | "analysis" | undefined;
type M4Station = "MATERIAL" | "GROUND" | "LOWG" | "2-1" | "2-2" | "2-3" | "2-4" | "ANALYSIS";
type DisplayGetter = () => HTMLDivElement | null;

function AssetModule({ file, position, rotation = [0, 0, 0], scale = 1, onClick }: { file: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number; onClick?: () => void }) {
  const { asset, error } = useModel(`${visualVariants.has(file) ? "/assets/game/generated/m0/" : GENERATED_ROOT}${file}`);
  useEffect(() => { if (error && process.env.NODE_ENV !== "production") console.warn(`[PlayCanvas M4] asset failed: ${file}`, error); }, [error, file]);
  if (!asset) return null;
  return <Entity name={`m4-${file}`} position={position} rotation={rotation} scale={[scale, scale, scale]} onClick={onClick}><Container asset={asset} /></Entity>;
}

function SiliconeStation({ position, onClick, name = "silicone-sample-station" }: { position: [number, number, number]; onClick: () => void; name?: string }) {
  const { asset, error } = useModel(`${GENERATED_ROOT}gravifire_sibal_sample_station.glb`);
  const sampleMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.63, 0.58, 0.42); material.metalness = 0.02; material.gloss = 0.15; material.update(); return material; }, []);
  useEffect(() => {
    if (error && process.env.NODE_ENV !== "production") console.warn("[PlayCanvas M4] silicone station failed", error);
    const resource = asset?.resource as { meshInstances?: Array<{ node?: { name?: string }; material?: StandardMaterial }> } | undefined;
    resource?.meshInstances?.forEach((mesh) => { if (mesh.node?.name === "sibal_sample") mesh.material = sampleMaterial; });
  }, [asset, error, sampleMaterial]);
  if (!asset) return null;
  return <Entity name={name} position={position} onClick={onClick}><Container asset={asset} /></Entity>;
}

function ProductionCharacter({ playerRef, clip, onReady }: { playerRef: MutableRefObject<PcEntity | null>; clip: string; onReady: (ready: boolean) => void }) {
  const { asset, error } = useModel(CHARACTER_ASSET);
  useEffect(() => { if (error && process.env.NODE_ENV !== "production") console.warn("[PlayCanvas M4] character asset failed", error); onReady(Boolean(asset && !error)); }, [asset, error, onReady]);
  useEffect(() => {
    const entity = playerRef.current;
    const resource = asset?.resource as { animations?: Array<{ type: string; name: string; resource: AnimTrack }> } | undefined;
    if (!entity || !resource?.animations?.length) return;
    if (!entity.anim) entity.addComponent("anim", { activate: true });
    const selected = resource.animations.find((animation) => animation.type === "animation" && animation.name === clip);
    if (!selected) return;
    entity.anim?.assignAnimation("animation", selected.resource, undefined, 1, true);
    entity.anim?.baseLayer?.play("animation");
  }, [asset, clip, playerRef]);
  if (!asset) return null;
  return <Entity name="m4-human-mission-engineer" ref={playerRef} position={[0, 0, 1.15]} rotation={[0, 180, 0]} scale={[0.86, 0.86, 0.86]}><Render type="asset" asset={asset} castShadows receiveShadows /></Entity>;
}

function FallbackCharacter({ playerRef, material, darkMaterial }: { playerRef: MutableRefObject<PcEntity | null>; material: StandardMaterial; darkMaterial: StandardMaterial }) {
  return <Entity name="m4-procedural-fallback-character" ref={playerRef} position={[0, 0, 1.15]}><Entity name="torso" position={[0, 1.05, 0]} scale={[0.62, 0.85, 0.36]}><Render type="box" material={material} /></Entity><Entity name="helmet" position={[0, 1.85, 0]} scale={[0.34, 0.34, 0.34]}><Render type="sphere" material={darkMaterial} /></Entity><Entity name="backpack" position={[0, 1.15, 0.38]} scale={[0.38, 0.58, 0.18]}><Render type="box" material={darkMaterial} /></Entity><Entity name="left-leg" position={[-0.2, 0.38, 0]} scale={[0.18, 0.62, 0.2]}><Render type="capsule" material={darkMaterial} /></Entity><Entity name="right-leg" position={[0.2, 0.38, 0]} scale={[0.18, 0.62, 0.2]}><Render type="capsule" material={darkMaterial} /></Entity></Entity>;
}

function Controller({ playerRef, cameraRef, initialPosition, onInteract, onMovementState, stage }: { playerRef: MutableRefObject<PcEntity | null>; cameraRef: MutableRefObject<PcEntity | null>; initialPosition: { x: number; z: number }; onInteract: (position: { x: number; z: number }) => void; onMovementState: (state: keyof typeof CHARACTER_CLIPS) => void; stage: M4PlayCanvasStage }) {
  const app = useApp();
  const state = useRef({ x: initialPosition.x, z: initialPosition.z, yaw: 0, pitch: 8, lastMovement: "IDLE" as keyof typeof CHARACTER_CLIPS, keys: new Set<string>() });
  useEffect(() => {
    const canvas = app.graphicsDevice.canvas;
    const paused = { value: false };
    const onPause = (event: Event) => { paused.value = Boolean((event as CustomEvent<boolean>).detail); if (paused.value) state.current.keys.clear(); };
    const down = (event: KeyboardEvent) => { if (paused.value) return; state.current.keys.add(event.key.toLowerCase()); if (["w", "a", "s", "d", "shift"].includes(event.key.toLowerCase())) event.preventDefault(); if (event.key.toLowerCase() === "e") onInteract({ x: state.current.x, z: state.current.z }); };
    const up = (event: KeyboardEvent) => state.current.keys.delete(event.key.toLowerCase());
    const move = (event: PointerEvent) => { if (document.pointerLockElement !== canvas) return; state.current.yaw -= event.movementX * 0.08; state.current.pitch = Math.max(2, Math.min(24, state.current.pitch - event.movementY * 0.05)); };
    const lock = () => canvas.requestPointerLock?.();
    const update = (dt: number) => { if (paused.value) return; const s = state.current; const forward = Number(s.keys.has("w")) - Number(s.keys.has("s")); const strafe = Number(s.keys.has("d")) - Number(s.keys.has("a")); const speed = s.keys.has("shift") ? 3.6 : 2.25; const movement = forward || strafe ? (s.keys.has("shift") ? "RUN" : "WALK") : "IDLE"; if (movement !== s.lastMovement) { s.lastMovement = movement; onMovementState(movement); } const angle = s.yaw * Math.PI / 180; const moveX = Math.cos(angle) * strafe - Math.sin(angle) * forward; const moveZ = -Math.cos(angle) * forward - Math.sin(angle) * strafe; s.x = Math.max(-3.25, Math.min(3.25, s.x + moveX * speed * dt)); s.z = Math.max(-19.5, Math.min(3.2, s.z + moveZ * speed * dt)); const player = playerRef.current; const camera = cameraRef.current; if (!player || !camera) return; player.setPosition(s.x, 0, s.z); if (forward || strafe) player.setEulerAngles(0, Math.atan2(moveX, moveZ) * 180 / Math.PI, 0); const distance = s.keys.has("shift") ? 3.1 : 2.8; const target = { x: s.x, y: 1.18, z: s.z - 0.42 }; camera.setPosition(s.x + 0.58, 1.72 + Math.sin(s.pitch * Math.PI / 180) * 0.42, s.z + distance); camera.lookAt(target.x, target.y, target.z); };
    app.on("update", update); window.addEventListener("mission-pause", onPause); window.addEventListener("keydown", down); window.addEventListener("keyup", up); window.addEventListener("pointermove", move); canvas.addEventListener("click", lock); return () => { app.off("update", update); window.removeEventListener("mission-pause", onPause); window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("pointermove", move); canvas.removeEventListener("click", lock); };
  }, [app, cameraRef, initialPosition.x, initialPosition.z, onInteract, onMovementState, playerRef, stage]);
  return null;
}

function WorldProjection({ cameraRef, displays }: { cameraRef: MutableRefObject<PcEntity | null>; displays: Array<{ getElement: DisplayGetter; position: readonly [number, number, number] }> }) {
  const app = useApp();
  useEffect(() => { const canvas = app.graphicsDevice.canvas; const update = () => { const camera = cameraRef.current?.camera; if (!camera) return; displays.forEach(({ getElement, position }) => { const element = getElement(); if (!element) return; const point = camera.worldToScreen(new Vec3(position[0], position[1], position[2])); const visible = point.z > 0 && point.x > -80 && point.x < canvas.clientWidth + 80 && point.y > -80 && point.y < canvas.clientHeight + 80; element.style.display = visible ? "grid" : "none"; if (visible) { element.style.left = `${point.x}px`; element.style.top = `${point.y}px`; } }); }; app.on("update", update); update(); return () => { app.off("update", update); }; }, [app, cameraRef, displays]);
  return null;
}

function ScreenSurface({ position, scale, material }: { position: [number, number, number]; scale: [number, number, number]; material: StandardMaterial }) { return <Entity name="m4-evidence-screen" position={position} scale={scale}><Render type="box" material={material} /></Entity>; }

function M4Scene({ session, reviewStage, cameraRef, onInteract }: { session: MissionSessionState; reviewStage?: ReviewStage; cameraRef: MutableRefObject<PcEntity | null>; onInteract: (station: M4Station) => void }) {
  const playerRef = useRef<PcEntity | null>(null); const [characterState, setCharacterState] = useState<keyof typeof CHARACTER_CLIPS>("IDLE"); const [characterReady, setCharacterReady] = useState(false);
  const suitMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.74, 0.78, 0.76); material.update(); return material; }, []); const darkMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.07, 0.1, 0.11); material.update(); return material; }, []);
  const analysisScreen = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.015, 0.04, 0.045); material.emissive = new Color(0.005, 0.02, 0.023); material.update(); return material; }, []); const groundScreen = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.18, 0.12, 0.05); material.emissive = new Color(0.06, 0.025, 0.006); material.update(); return material; }, []); const lowgScreen = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.025, 0.11, 0.13); material.emissive = new Color(0.01, 0.06, 0.08); material.update(); return material; }, []);
  const stage: M4PlayCanvasStage = session.phase === "GROUND" ? "GROUND" : session.phase === "LOWG" ? "LOWG" : session.phase === "SAMPLES" ? "SAMPLES" : session.phase === "ANALYSIS" ? "ANALYSIS" : "MATERIAL";
  const initialPosition = useMemo(() => reviewStage === "ground" ? M4_REVIEW_LAYOUT.ground.spawn : reviewStage === "lowg" ? M4_REVIEW_LAYOUT.lowg.spawn : reviewStage === "samples" ? M4_REVIEW_LAYOUT.samples.spawn : reviewStage === "analysis" ? M4_REVIEW_LAYOUT.analysis.spawn : M4_REVIEW_LAYOUT.material.spawn, [reviewStage]);
  const interactionAtPosition = useCallback((position: { x: number; z: number }) => { const targets: Record<M4PlayCanvasStage, { x: number; z: number }> = { MATERIAL: { x: 0, z: 0.8 }, GROUND: { x: -2.1, z: -6.1 }, LOWG: { x: 2.1, z: -10.1 }, SAMPLES: { x: 0, z: -14.65 }, ANALYSIS: { x: 0, z: -20.1 } }; const target = targets[stage]; if (Math.hypot(position.x - target.x, position.z - target.z) < 2.2) onInteract(stage === "MATERIAL" ? "MATERIAL" : stage === "GROUND" ? "GROUND" : stage === "LOWG" ? "LOWG" : stage === "ANALYSIS" ? "ANALYSIS" : "2-1"); }, [onInteract, stage]);
  return <><Entity name="m4-camera" ref={cameraRef} position={[0.58, 1.72, 3.95]}><Camera fov={64} nearClip={0.05} farClip={80} clearColor="#091116" /></Entity><Entity name="m4-key-light" rotation={[35, -25, 0]}><Light type="directional" intensity={1.4} color="#e7edf2" castShadows shadowBias={0.25} normalOffsetBias={0.08} shadowDistance={28} /></Entity><Entity name="m4-fill-light" position={[0, 3, -5]}><Light type="omni" intensity={1.15} range={16} color="#9fc7d9" /></Entity><Entity name="m4-ground-light" position={[-2, 2.5, -6.2]}><Light type="omni" intensity={0.85} range={5} color="#f0c89a" /></Entity><Entity name="m4-lowg-light" position={[2, 2.5, -10.2]}><Light type="omni" intensity={0.9} range={5} color="#a8d9e5" /></Entity><Entity name="m4-analysis-light" position={[0, 2.2, -19.4]}><Light type="omni" intensity={1.3} range={6} color="#f4e4c6" /></Entity>
    <AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, 0]} /><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -4.15]} /><AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, -8.35]} /><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -12.5]} /><AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, -16.7]} /><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -20.85]} />
    <SiliconeStation position={[0, 0, 0.8]} onClick={() => onInteract("MATERIAL")} /><AssetModule file="gravifire_equipment_rack.glb" position={[-2.8, 0, -1.5]} rotation={[0, Math.PI / 2, 0]} /><AssetModule file="gravifire_science_console.glb" position={[2.35, 0, -0.95]} onClick={() => onInteract("MATERIAL")} /><AssetModule file="gravifire_bulkhead_door.glb" position={[0, 0, -3.72]} />
    <AssetModule file="gravifire_equipment_rack.glb" position={[-2.75, 0, -6.1]} rotation={[0, Math.PI / 2, 0]} /><AssetModule file="gravifire_science_console.glb" position={[-2.1, 0, -6.1]} onClick={() => onInteract("GROUND")} /><ScreenSurface position={[-2.1, 1.18, -6.42]} scale={[0.72, 0.42, 0.03]} material={groundScreen} /><AssetModule file="gravifire_bulkhead_door.glb" position={[0, 0, -7.7]} />
    <AssetModule file="gravifire_equipment_rack.glb" position={[2.75, 0, -10.1]} rotation={[0, -Math.PI / 2, 0]} /><AssetModule file="gravifire_science_console.glb" position={[2.1, 0, -10.1]} onClick={() => onInteract("LOWG")} /><ScreenSurface position={[2.1, 1.18, -10.42]} scale={[0.48, 0.28, 0.02]} material={lowgScreen} /><AssetModule file="gravifire_bulkhead_door.glb" position={[0, 0, -11.85]} />
    <AssetModule file="gravifire_equipment_rack.glb" position={[-2.9, 0, -14.4]} rotation={[0, Math.PI / 2, 0]} />{family.map((record, index) => <AssetModule key={record.run.sourceExperimentId} file="gravifire_science_console.glb" position={[(index - 1.5) * 2.0, 0, -14.65]} scale={0.8} onClick={() => onInteract(record.run.sourceExperimentId as M4Station)} />)}<AssetModule file="gravifire_bulkhead_door.glb" position={[0, 0, -16.05]} />
    <AssetModule file="gravifire_equipment_rack.glb" position={[-3.25, 0, -19.55]} rotation={[0, Math.PI / 2, 0]} /><AssetModule file="gravifire_equipment_rack.glb" position={[3.25, 0, -19.55]} rotation={[0, -Math.PI / 2, 0]} /><AssetModule file="gravifire_analysis_wall.glb" position={[0, 0, -20.12]} scale={1.04} onClick={() => onInteract("ANALYSIS")} /><ScreenSurface position={[-1.35, 1.42, -20.38]} scale={[0.88, 0.52, 0.03]} material={analysisScreen} /><ScreenSurface position={[1.35, 1.42, -20.38]} scale={[0.88, 0.52, 0.03]} material={analysisScreen} />
    <ProductionCharacter playerRef={playerRef} clip={CHARACTER_CLIPS[characterState]} onReady={setCharacterReady} />{!characterReady && <FallbackCharacter playerRef={playerRef} material={suitMaterial} darkMaterial={darkMaterial} />}<Controller playerRef={playerRef} cameraRef={cameraRef} initialPosition={initialPosition} onInteract={interactionAtPosition} onMovementState={setCharacterState} stage={stage} />
  </>;
}

function ProjectedM4Evidence({ stage, activePanel, setDisplayRef }: { stage: M4PlayCanvasStage; activePanel: string | null; setDisplayRef: (id: string) => (element: HTMLDivElement | null) => void }) {
  const record = records["2-1"];
  const lowg = record.data.burnTime.rawValue;
  const lowgLength = record.data.microgravityBurnLength.rawValue;
  if (stage === "ANALYSIS") return <><div ref={setDisplayRef("header")} className="playcanvas-projected-header"><span>SILICONE</span><strong>SAFFIRE-II / PSI-99</strong><small>SOURCE-BOUND COMPARISON</small></div><div ref={setDisplayRef("left")} className="playcanvas-projected-monitor playcanvas-projected-monitor--s1"><span>1-g REFERENCE</span><strong>{record.data.normalGravityReference.burnLength.rawValue}</strong><small>SOURCE ROW · 2-1</small><em>COMPLETE · {record.data.normalGravityReference.spreadRate.rawValue}</em></div><div ref={setDisplayRef("right")} className="playcanvas-projected-monitor playcanvas-projected-monitor--s2"><span>LOW-g</span><strong>{lowg}</strong><b className="playcanvas-m4-hero-value">{lowgLength}</b><small>LOW-g BURN LENGTH · SILICONE 2-1</small><em>PSI-99 · SOURCE ROW</em></div><div ref={setDisplayRef("limit")} className="playcanvas-projected-limit">GROUND RESULT DOES NOT ESTABLISH A UNIVERSAL MATERIAL RULE</div></>;
  if (stage === "GROUND") return <div ref={setDisplayRef("ground")} className="playcanvas-projected-monitor playcanvas-projected-monitor--s2"><span>1-g REFERENCE · SILICONE 2-1</span><strong>{record.data.normalGravityReference.burnLength.rawValue}</strong><small>SOURCE ROW · PSI-99</small></div>;
  if (stage === "LOWG") return <div ref={setDisplayRef("lowg")} className="playcanvas-projected-monitor playcanvas-projected-monitor--s1"><span>LOW-g FLIGHT · SILICONE 2-1</span><strong>{lowg}</strong><small>LOW-g BURN LENGTH · {lowgLength}</small></div>;
  if (stage === "SAMPLES") return <>{family.map((item) => <div key={item.run.sourceExperimentId} ref={setDisplayRef(item.run.sourceExperimentId)} className={`playcanvas-projected-monitor playcanvas-projected-monitor--${item.run.sourceExperimentId === "2-4" ? "s2" : "s1"}`}><span>{item.run.sourceExperimentId} · {item.data.normalizedMaterial}</span><strong>{item.data.burnTime.rawValue}</strong><small>LOW-g LENGTH · {item.data.microgravityBurnLength.rawValue}</small><em>{item.data.sampleThickness.rawValue}{item.data.sampleThickness.status === "REVIEW_REQUIRED" ? " · SOURCE REVIEW REQUIRED" : ""}</em>{activePanel === item.run.sourceExperimentId && <i>{refs[item.run.sourceExperimentId].sourcePathOrCitation}</i>}</div>)}</>;
  return <div ref={setDisplayRef("material")} className="playcanvas-projected-header"><span>MATERIAL INSPECTION</span><strong>SILICONE</strong><small>SAFFIRE-II · PSI-99</small></div>;
}

export default function PlayCanvasM4Pilot({ reviewStage }: { reviewStage?: ReviewStage }) {
  const { session, patchSession, markStationReviewed } = useMissionSession("m4-playcanvas"); const [message, setMessage] = useState("EMBER · Materials evidence channel online."); const [activePanel, setActivePanel] = useState<string | null>(null); const cameraRef = useRef<PcEntity | null>(null); const displayElements = useMemo(() => new Map<string, HTMLDivElement>(), []);
  const setDisplayRef = useCallback((id: string) => (element: HTMLDivElement | null) => { if (element) displayElements.set(id, element); else displayElements.delete(id); }, [displayElements]);
  useEffect(() => { if (reviewStage) patchSession(m4ReviewSessionPatch(reviewStage)); }, [patchSession, reviewStage]);
  const stage: M4PlayCanvasStage = session.phase === "GROUND" ? "GROUND" : session.phase === "LOWG" ? "LOWG" : session.phase === "SAMPLES" ? "SAMPLES" : session.phase === "ANALYSIS" ? "ANALYSIS" : "MATERIAL";
  const handleInteract = useCallback((station: M4Station) => { if (station === "MATERIAL" && stage === "MATERIAL") { patchSession({ phase: "GROUND", activeObjective: "REVIEW 1-g REFERENCE" }); setMessage("EMBER · Silicone sample identified. Ground reference loaded."); return; } if (station === "GROUND" && stage === "GROUND") { patchSession({ phase: "LOWG", activeObjective: "REVIEW LOW-g FLIGHT RECORD" }); setMessage("EMBER · Ground reference loaded. Review the flight record."); return; } if (station === "LOWG" && stage === "LOWG") { patchSession({ phase: "SAMPLES", activeObjective: "INSPECT SAMPLES 2-1 THROUGH 2-4" }); setMessage("EMBER · Flight evidence loaded. Inspect the four source rows."); return; } if (["2-1", "2-2", "2-3", "2-4"].includes(station) && stage === "SAMPLES") { markStationReviewed(station); setActivePanel(station); const reviewed = Array.from(new Set([...session.reviewedStations, station])); if (["2-1", "2-2", "2-3", "2-4"].every((id) => reviewed.includes(id))) { patchSession({ phase: "ANALYSIS", activeObjective: "REVIEW SOURCE COMPARISON", reviewedStations: reviewed }); setMessage("EMBER · Four source rows reviewed. Comparison ready."); } return; } if (station === "ANALYSIS" && stage === "ANALYSIS") { setActivePanel("ANALYSIS"); setMessage("EMBER · The source does not support a universal material rule."); } }, [markStationReviewed, patchSession, session.reviewedStations, stage]);
  const projected = stage === "ANALYSIS" ? [{ getElement: () => displayElements.get("left") ?? null, position: M4_REVIEW_LAYOUT.analysis.left }, { getElement: () => displayElements.get("right") ?? null, position: M4_REVIEW_LAYOUT.analysis.right }, { getElement: () => displayElements.get("header") ?? null, position: M4_REVIEW_LAYOUT.analysis.header }, { getElement: () => displayElements.get("limit") ?? null, position: M4_REVIEW_LAYOUT.analysis.limit }] : stage === "GROUND" ? [{ getElement: () => displayElements.get("ground") ?? null, position: M4_REVIEW_LAYOUT.ground.anchor }] : stage === "LOWG" ? [{ getElement: () => displayElements.get("lowg") ?? null, position: M4_REVIEW_LAYOUT.lowg.anchor }] : stage === "SAMPLES" ? family.map((item, index) => ({ getElement: () => displayElements.get(item.run.sourceExperimentId) ?? null, position: M4_REVIEW_LAYOUT.samples.anchors[index] })) : [{ getElement: () => displayElements.get("material") ?? null, position: M4_REVIEW_LAYOUT.material.anchor }];
  const objective = stage === "MATERIAL" ? "INSPECT SILICONE SAMPLE" : stage === "GROUND" ? "REVIEW 1-g REFERENCE" : stage === "LOWG" ? "REVIEW LOW-g FLIGHT RECORD" : stage === "SAMPLES" ? "INSPECT SAMPLES 2-1 THROUGH 2-4" : "REVIEW SOURCE COMPARISON";
  const location = stage === "MATERIAL" ? "MATERIAL INSPECTION · SILICONE" : stage === "GROUND" ? "1-g REFERENCE ZONE" : stage === "LOWG" ? "LOW-g FLIGHT EVIDENCE ZONE" : stage === "SAMPLES" ? `SAMPLE WALL · ${session.reviewedStations.filter((id) => id.startsWith("2-")).length} / 4` : "ANALYSIS BAY · EVIDENCE REVIEW";
  return <div className="playcanvas-pilot"><Application fillMode={FILLMODE_FILL_WINDOW} resolutionMode={RESOLUTION_AUTO} graphicsDeviceOptions={{ antialias: true, alpha: false }}><M4Scene session={session} reviewStage={reviewStage} cameraRef={cameraRef} onInteract={handleInteract} /><WorldProjection cameraRef={cameraRef} displays={projected} /></Application><div className="playcanvas-hud" aria-label="M4 PlayCanvas HUD"><div className="playcanvas-objective"><span>M4 · {m4Mission.title}</span><strong>{objective}</strong><small>{location}</small></div><div className="playcanvas-crosshair">·</div><div className="playcanvas-ember">{message}</div><ProjectedM4Evidence stage={stage} activePanel={activePanel} setDisplayRef={setDisplayRef} /></div></div>;
}
