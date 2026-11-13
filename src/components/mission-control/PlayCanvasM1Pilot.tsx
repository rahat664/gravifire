"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Application, Container, Entity } from "@playcanvas/react";
import { Camera, Light, Render } from "@playcanvas/react/components";
import { useApp, useModel } from "@playcanvas/react/hooks";
import { Color, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO, StandardMaterial, Vec3, type AnimTrack, type Entity as PcEntity } from "playcanvas";
import { m1Mission } from "@/data/missions/m1-sibal";
import { m1EvidenceReference, m1SourceSummary, resolveM1Pair, type M1SourceRecord } from "@/lib/m1-evidence";
import { useMissionSession, type MissionSessionState } from "@/lib/mission-session";
import { M1_PLAYCANVAS_DISPLAY_ANCHORS, m1ReviewSessionPatch } from "@/lib/m1-playcanvas";

const KENNEY_ROOT = "/assets/game/environment/m1/";
const visualVariants = new Set(["gravifire_corridor_4m.glb", "gravifire_lab_shell_8x8.glb", "gravifire_bulkhead_door.glb", "gravifire_equipment_rack.glb", "gravifire_science_console.glb", "gravifire_analysis_wall.glb"]);
const GENERATED_ROOT = "/assets/game/generated/m1/";
const CHARACTER_ASSET = "/assets/game/character/quaternius-human-astronaut.glb";
const CHARACTER_CLIPS = { IDLE: "CharacterArmature|Idle", WALK: "CharacterArmature|Walk", RUN: "CharacterArmature|Run" } as const;
const m1Pair = resolveM1Pair();

type ReviewStage = "replay" | "analysis" | undefined;
type PilotStage = "PREP" | "S1" | "S2" | "ANALYSIS";
type StationId = "SIBAL" | "S1" | "S2" | "ANALYSIS";

function sourceDisplay(record: M1SourceRecord) {
  const summary = m1SourceSummary(record);
  const evidence = m1EvidenceReference(record);
  return { summary, evidence };
}

const SOURCE_VIEWS = { S1: sourceDisplay(m1Pair.s1), S2: sourceDisplay(m1Pair.s2) };

type AssetModuleProps = { file: string; root?: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number; onClick?: () => void };

function AssetModule({ file, root = KENNEY_ROOT, position, rotation = [0, 0, 0], scale = 1, onClick }: AssetModuleProps) {
  const { asset, error } = useModel(`${root === GENERATED_ROOT && visualVariants.has(file) ? "/assets/game/generated/m0/" : root}${file}`);
  useEffect(() => { if (error && process.env.NODE_ENV !== "production") console.warn(`[PlayCanvas M1] asset failed: ${file}`, error); }, [error, file]);
  if (!asset) return null;
  return <Entity name={`m1-${file}`} position={position} rotation={rotation} scale={[scale, scale, scale]} onClick={onClick}><Container asset={asset} /></Entity>;
}

function SibalStation({ onClick, position = [0, 0, 0.8], name = "sibal-preparation-station" }: { onClick: () => void; position?: [number, number, number]; name?: string }) {
  const { asset, error } = useModel(`${GENERATED_ROOT}gravifire_sibal_sample_station.glb`);
  const fabricMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.72, 0.67, 0.53); material.metalness = 0; material.gloss = 0.12; material.update(); return material; }, []);
  const instrumentMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.08, 0.13, 0.15); material.metalness = 0.45; material.gloss = 0.34; material.update(); return material; }, []);
  useEffect(() => {
    if (error && process.env.NODE_ENV !== "production") console.warn("[PlayCanvas M1] SIBAL station failed", error);
    const resource = asset?.resource as { meshInstances?: Array<{ node?: { name?: string }; material?: StandardMaterial }> } | undefined;
    resource?.meshInstances?.forEach((meshInstance) => { const name = meshInstance.node?.name ?? ""; if (name === "sibal_sample") meshInstance.material = fabricMaterial; if (name === "sample_display" || name === "sensor_bar") meshInstance.material = instrumentMaterial; });
  }, [asset, error, fabricMaterial, instrumentMaterial]);
  if (!asset) return null;
  return <Entity name={name} position={position} onClick={onClick}><Container asset={asset} /></Entity>;
}

function FallbackCharacter({ playerRef, material, darkMaterial }: { playerRef: MutableRefObject<PcEntity | null>; material: StandardMaterial; darkMaterial: StandardMaterial }) {
  return <Entity name="procedural-fallback-character" ref={playerRef} position={[0, 0, 1.6]}>
    <Entity name="torso" position={[0, 1.05, 0]} scale={[0.62, 0.85, 0.36]}><Render type="box" material={material} /></Entity>
    <Entity name="helmet" position={[0, 1.85, 0]} scale={[0.34, 0.34, 0.34]}><Render type="sphere" material={darkMaterial} /></Entity>
    <Entity name="backpack" position={[0, 1.15, 0.38]} scale={[0.38, 0.58, 0.18]}><Render type="box" material={darkMaterial} /></Entity>
    <Entity name="left-arm" position={[-0.46, 1.1, 0]} rotation={[0, 0, -8]} scale={[0.16, 0.62, 0.16]}><Render type="capsule" material={material} /></Entity>
    <Entity name="right-arm" position={[0.46, 1.1, 0]} rotation={[0, 0, 8]} scale={[0.16, 0.62, 0.16]}><Render type="capsule" material={material} /></Entity>
    <Entity name="left-leg" position={[-0.2, 0.38, 0]} scale={[0.18, 0.62, 0.2]}><Render type="capsule" material={darkMaterial} /></Entity>
    <Entity name="right-leg" position={[0.2, 0.38, 0]} scale={[0.18, 0.62, 0.2]}><Render type="capsule" material={darkMaterial} /></Entity>
    <Entity name="left-boot" position={[-0.2, 0.08, -0.08]} scale={[0.24, 0.12, 0.38]}><Render type="box" material={darkMaterial} /></Entity>
    <Entity name="right-boot" position={[0.2, 0.08, -0.08]} scale={[0.24, 0.12, 0.38]}><Render type="box" material={darkMaterial} /></Entity>
  </Entity>;
}

function ProductionCharacter({ playerRef, clip, onReady }: { playerRef: MutableRefObject<PcEntity | null>; clip: string; onReady: (ready: boolean) => void }) {
  const { asset, error } = useModel(CHARACTER_ASSET);
  useEffect(() => { if (error && process.env.NODE_ENV !== "production") console.warn("[PlayCanvas M1] character asset failed", error); onReady(Boolean(asset && !error)); }, [asset, error, onReady]);
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
  return <Entity name="human-mission-engineer" ref={playerRef} position={[0, 0, 1.15]} rotation={[0, 180, 0]} scale={[0.86, 0.86, 0.86]}><Render type="asset" asset={asset} castShadows receiveShadows /></Entity>;
}

function PilotController({ playerRef, cameraRef, initialPosition, initialYaw, onInteract, onMovementState }: { playerRef: MutableRefObject<PcEntity | null>; cameraRef: MutableRefObject<PcEntity | null>; initialPosition: { x: number; z: number }; initialYaw: number; onInteract: (position: { x: number; z: number }) => void; onMovementState: (state: keyof typeof CHARACTER_CLIPS) => void }) {
  const app = useApp();
  const state = useRef({ x: initialPosition.x, z: initialPosition.z, yaw: initialYaw, pitch: 8, lastMovement: "IDLE" as keyof typeof CHARACTER_CLIPS, keys: new Set<string>() });
  useEffect(() => {
    const canvas = app.graphicsDevice.canvas;
    const paused = { value: false };
    const onPause = (event: Event) => { paused.value = Boolean((event as CustomEvent<boolean>).detail); if (paused.value) state.current.keys.clear(); };
    const keyDown = (event: KeyboardEvent) => { if (paused.value) return; state.current.keys.add(event.key.toLowerCase()); if (event.key.toLowerCase() === "e") onInteract({ x: state.current.x, z: state.current.z }); if (["w", "a", "s", "d", "shift"].includes(event.key.toLowerCase())) event.preventDefault(); };
    const keyUp = (event: KeyboardEvent) => state.current.keys.delete(event.key.toLowerCase());
    const pointerMove = (event: PointerEvent) => { if (document.pointerLockElement !== canvas) return; state.current.yaw -= event.movementX * 0.08; state.current.pitch = Math.max(2, Math.min(24, state.current.pitch - event.movementY * 0.05)); };
    const requestLock = () => canvas.requestPointerLock?.();
    window.addEventListener("keydown", keyDown); window.addEventListener("keyup", keyUp); window.addEventListener("pointermove", pointerMove); canvas.addEventListener("click", requestLock);
    const update = (dt: number) => {
      if (paused.value) return;
      const s = state.current; const forward = Number(s.keys.has("w")) - Number(s.keys.has("s")); const strafe = Number(s.keys.has("d")) - Number(s.keys.has("a")); const speed = s.keys.has("shift") ? 3.6 : 2.25; const movementState = forward || strafe ? (s.keys.has("shift") ? "RUN" : "WALK") : "IDLE";
      if (movementState !== s.lastMovement) { s.lastMovement = movementState; onMovementState(movementState); }
      const angle = (s.yaw * Math.PI) / 180; const moveX = Math.cos(angle) * strafe - Math.sin(angle) * forward; const moveZ = -Math.cos(angle) * forward - Math.sin(angle) * strafe;
      s.x = Math.max(-3.2, Math.min(3.2, s.x + moveX * speed * dt)); s.z = Math.max(-19.45, Math.min(3.2, s.z + moveZ * speed * dt));
      const player = playerRef.current; const camera = cameraRef.current; if (!player || !camera) return;
      player.setPosition(s.x, 0, s.z); if (forward || strafe) player.setEulerAngles(0, Math.atan2(moveX, moveZ) * 180 / Math.PI, 0);
      const target = { x: s.x, y: 1.18, z: s.z - 0.42 }; const distance = s.keys.has("shift") ? 3.1 : 2.8; const shoulder = 0.58; const cameraX = s.x + Math.sin(angle) * distance + Math.cos(angle) * shoulder; const cameraZ = s.z + Math.cos(angle) * distance - Math.sin(angle) * shoulder;
      camera.setPosition(cameraX, 1.72 + Math.sin((s.pitch * Math.PI) / 180) * 0.42, cameraZ); camera.lookAt(target.x, target.y, target.z);
    };
    app.on("update", update); window.addEventListener("mission-pause", onPause);
    return () => { app.off("update", update); window.removeEventListener("mission-pause", onPause); canvas.removeEventListener("click", requestLock); window.removeEventListener("keydown", keyDown); window.removeEventListener("keyup", keyUp); window.removeEventListener("pointermove", pointerMove); };
  }, [app, cameraRef, initialPosition.x, initialPosition.z, initialYaw, onInteract, onMovementState, playerRef]);
  return null;
}

function TargetMarker({ position, material }: { position: [number, number, number]; material: StandardMaterial }) { return <Entity name="m1-active-objective-marker" position={position} rotation={[0, 45, 45]} scale={[0.11, 0.11, 0.11]}><Render type="box" material={material} /></Entity>; }
function ScreenSurface({ position, scale, material }: { position: [number, number, number]; scale: [number, number, number]; material: StandardMaterial }) { return <Entity name="evidence-screen-surface" position={position} scale={scale}><Render type="box" material={material} /></Entity>; }

type DisplayRef = MutableRefObject<HTMLDivElement | null>;

function WorldProjection({ cameraRef, displays }: { cameraRef: MutableRefObject<PcEntity | null>; displays: Array<{ ref: DisplayRef; position: readonly [number, number, number] }> }) {
  const app = useApp();
  useEffect(() => {
    const canvas = app.graphicsDevice.canvas;
    const update = () => {
      const camera = cameraRef.current?.camera;
      if (!camera) return;
      displays.forEach(({ ref, position }) => {
        const element = ref.current;
        if (!element) return;
        const projected = camera.worldToScreen(new Vec3(position[0], position[1], position[2]));
        const visible = projected.z > 0 && projected.x > -80 && projected.x < canvas.clientWidth + 80 && projected.y > -80 && projected.y < canvas.clientHeight + 80;
        element.style.display = visible ? "grid" : "none";
        if (visible) { element.style.left = `${projected.x}px`; element.style.top = `${projected.y}px`; }
      });
    };
    app.on("update", update); update();
    return () => { app.off("update", update); };
  }, [app, cameraRef, displays]);
  return null;
}

function PilotScene({ session, reviewStage, cameraRef, onInteract }: { session: MissionSessionState; reviewStage?: ReviewStage; cameraRef: MutableRefObject<PcEntity | null>; onInteract: (station: StationId) => void }) {
  const playerRef = useRef<PcEntity | null>(null); const [characterState, setCharacterState] = useState<keyof typeof CHARACTER_CLIPS>("IDLE"); const [characterReady, setCharacterReady] = useState(false);
  const suitMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.74, 0.78, 0.76); material.metalness = 0.05; material.gloss = 0.2; material.update(); return material; }, []);
  const darkMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.07, 0.1, 0.11); material.metalness = 0.3; material.gloss = 0.3; material.update(); return material; }, []);
  const markerMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.94, 0.57, 0.22); material.emissive = new Color(0.22, 0.08, 0.01); material.update(); return material; }, []);
  const screenMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.015, 0.04, 0.045); material.emissive = new Color(0.005, 0.02, 0.023); material.metalness = 0.2; material.gloss = 0.6; material.update(); return material; }, []);
  const s1ScreenMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.025, 0.11, 0.13); material.emissive = new Color(0.01, 0.06, 0.08); material.metalness = 0.2; material.gloss = 0.6; material.update(); return material; }, []);
  const s2ScreenMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.13, 0.08, 0.035); material.emissive = new Color(0.08, 0.03, 0.006); material.metalness = 0.2; material.gloss = 0.6; material.update(); return material; }, []);
  const stage = session.phase === "REPLAY_S1" ? "S1" : session.phase === "REPLAY_S2" ? "S2" : session.phase === "ANALYSIS" ? "ANALYSIS" : "PREP";
  const initialPosition = useMemo(() => reviewStage === "replay" ? { x: -0.3, z: -6.7 } : reviewStage === "analysis" ? { x: -1.2, z: -17.2 } : { x: 0, z: 1.15 }, [reviewStage]);
  const interactionForPosition = useCallback((position: { x: number; z: number }) => {
    const targets: Record<PilotStage, { x: number; z: number }> = { PREP: { x: 0, z: 0.8 }, S1: { x: -2.25, z: -8.5 }, S2: { x: 2.25, z: -8.5 }, ANALYSIS: { x: 0, z: -20.1 } };
    const target = targets[stage]; if (Math.hypot(position.x - target.x, position.z - target.z) < 1.65) onInteract(stage === "PREP" ? "SIBAL" : stage);
  }, [onInteract, stage]);
  return <>
    <Entity name="pilot-camera" ref={cameraRef} position={[0.58, 1.72, 3.95]}><Camera fov={64} nearClip={0.05} farClip={80} clearColor="#091116" /></Entity>
    <Entity name="key-light" rotation={[35, -25, 0]}><Light type="directional" intensity={1.4} color="#e7edf2" castShadows shadowBias={0.25} normalOffsetBias={0.08} shadowDistance={28} /></Entity><Entity name="fill-light" position={[0, 3, 1]}><Light type="omni" intensity={1.15} range={14} color="#9fc7d9" /></Entity>
    <Entity name="replay-fill" position={[0, 2.7, -8.4]}><Light type="omni" intensity={1.2} range={12} color="#d9eced" /></Entity><Entity name="analysis-fill" position={[0, 2.7, -16.6]}><Light type="omni" intensity={1.05} range={11} color="#b8d5df" /></Entity><Entity name="analysis-wall-light" position={[0, 2.2, -19.4]}><Light type="omni" intensity={1.25} range={5.5} color="#f4e4c6" /></Entity>
    <Entity name="ambient-prop-light" position={[0, 2.8, -4]}><Light type="omni" intensity={0.8} range={10} color="#ffd39b" /></Entity><Entity name="sibal-task-light" position={[0, 2.2, 0.8]}><Light type="omni" intensity={0.65} range={3.2} color="#fff1d2" /></Entity><Entity name="replay-station-light" position={[0, 2.2, -8.5]}><Light type="omni" intensity={0.8} range={4.5} color="#bfe7ed" /></Entity><Entity name="doorway-practical" position={[0, 1.65, -3.08]}><Light type="omni" intensity={0.9} range={5.5} color="#d9edf0" /></Entity>
    <AssetModule file="gravifire_lab_shell_8x8.glb" root={GENERATED_ROOT} position={[0, 0, 0]} /><AssetModule file="gravifire_corridor_4m.glb" root={GENERATED_ROOT} position={[0, 0, -4.15]} /><AssetModule file="gravifire_lab_shell_8x8.glb" root={GENERATED_ROOT} position={[0, 0, -8.35]} /><AssetModule file="gravifire_corridor_4m.glb" root={GENERATED_ROOT} position={[0, 0, -12.5]} /><AssetModule file="gravifire_lab_shell_8x8.glb" root={GENERATED_ROOT} position={[0, 0, -16.7]} />
    <SibalStation onClick={() => onInteract("SIBAL")} /><AssetModule file="gravifire_equipment_rack.glb" root={GENERATED_ROOT} position={[-2.85, 0, -1.65]} rotation={[0, Math.PI / 2, 0]} /><AssetModule file="gravifire_equipment_rack.glb" root={GENERATED_ROOT} position={[2.85, 0, -1.65]} rotation={[0, -Math.PI / 2, 0]} /><AssetModule file="gravifire_science_console.glb" root={GENERATED_ROOT} position={[2.35, 0, -0.95]} rotation={[0, -0.12, 0]} /><AssetModule file="gravifire_bulkhead_door.glb" root={GENERATED_ROOT} position={[0, 0, -3.72]} />
    <AssetModule file="gravifire_equipment_rack.glb" root={GENERATED_ROOT} position={[-2.75, 0, -9.9]} rotation={[0, 90, 0]} /><AssetModule file="gravifire_equipment_rack.glb" root={GENERATED_ROOT} position={[2.75, 0, -9.9]} rotation={[0, -90, 0]} /><SibalStation name="saffire-replay-apparatus" position={[0, 0, -8.5]} onClick={() => onInteract("SIBAL")} /><AssetModule file="gravifire_science_console.glb" root={GENERATED_ROOT} position={[-2.25, 0, -8.5]} onClick={() => onInteract("S1")} /><AssetModule file="gravifire_science_console.glb" root={GENERATED_ROOT} position={[2.25, 0, -8.5]} onClick={() => onInteract("S2")} /><ScreenSurface position={[-2.25, 1.18, -8.82]} scale={[0.42, 0.24, 0.025]} material={s1ScreenMaterial} /><ScreenSurface position={[2.25, 1.18, -8.82]} scale={[0.42, 0.24, 0.025]} material={s2ScreenMaterial} /><AssetModule file="gravifire_bulkhead_door.glb" root={GENERATED_ROOT} position={[0, 0, -11.95]} />
    <AssetModule file="gravifire_analysis_wall.glb" root={GENERATED_ROOT} position={[0, 0, -20.12]} scale={1.04} onClick={() => onInteract("ANALYSIS")} /><ScreenSurface position={[-1.35, 1.42, -20.38]} scale={[0.88, 0.52, 0.03]} material={screenMaterial} /><ScreenSurface position={[1.35, 1.42, -20.38]} scale={[0.88, 0.52, 0.03]} material={screenMaterial} />
    {stage === "PREP" && <TargetMarker position={[0, 1.88, 0.8]} material={markerMaterial} />}{stage === "S1" && <TargetMarker position={[-2.25, 1.98, -8.5]} material={markerMaterial} />}{stage === "S2" && <TargetMarker position={[2.25, 1.98, -8.5]} material={markerMaterial} />}{stage === "ANALYSIS" && <TargetMarker position={[0, 2.65, -20.05]} material={markerMaterial} />}
    <ProductionCharacter playerRef={playerRef} clip={CHARACTER_CLIPS[characterState]} onReady={setCharacterReady} />{!characterReady && <FallbackCharacter playerRef={playerRef} material={suitMaterial} darkMaterial={darkMaterial} />}<PilotController playerRef={playerRef} cameraRef={cameraRef} initialPosition={initialPosition} initialYaw={0} onInteract={interactionForPosition} onMovementState={setCharacterState} />
  </>;
}

function ProjectedEvidence({ stage, activePanel, s1Ref, s2Ref, headerRef, limitRef }: { stage: PilotStage; activePanel: string | null; s1Ref: DisplayRef; s2Ref: DisplayRef; headerRef: DisplayRef; limitRef: DisplayRef }) {
  const renderMonitor = (id: "S1" | "S2") => {
    const view = SOURCE_VIEWS[id];
    return <div ref={id === "S1" ? s1Ref : s2Ref} className={`playcanvas-projected-monitor playcanvas-projected-monitor--${id.toLowerCase()}`} aria-label={`${id} recorded evidence`}><span>{id} · {view.summary.direction}</span><strong>{String(view.summary.burnTime.rawValue)} s</strong><small>RECORDED BURN TIME · AIR FLOW {String(view.summary.airflow.rawValue)} cm/s</small><em>{view.evidence.sourceRecordId} · {view.evidence.investigationId}</em>{activePanel === id && <i>{view.evidence.sourcePathOrCitation}</i>}</div>;
  };
  if (stage === "ANALYSIS") return <><div ref={headerRef} className="playcanvas-projected-header"><span>SIBAL</span><strong>SAFFIRE-I / PSI-98</strong><small>RECORDED SOURCE COMPARISON</small></div>{renderMonitor("S1")}{renderMonitor("S2")}<div ref={limitRef} className="playcanvas-projected-limit">NOT A UNIVERSAL CONTROL LAW</div></>;
  if (stage === "S1" || stage === "S2") return <><div ref={headerRef} className="playcanvas-projected-header"><span>SAFFIRE-I · PSI-98 · SOURCE RUNS</span><strong>REPLAY CHAMBER</strong></div>{renderMonitor("S1")}{renderMonitor("S2")}</>;
  return null;
}

export default function PlayCanvasM1Pilot({ reviewStage }: { reviewStage?: ReviewStage }) {
  const { session, patchSession, markStationReviewed } = useMissionSession("m1-playcanvas");
  const [message, setMessage] = useState("EMBER · Research channel online."); const [activePanel, setActivePanel] = useState<string | null>(null);
  const cameraRef = useRef<PcEntity | null>(null);
  const s1Ref = useRef<HTMLDivElement | null>(null); const s2Ref = useRef<HTMLDivElement | null>(null); const headerRef = useRef<HTMLDivElement | null>(null); const limitRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { if (reviewStage) patchSession(m1ReviewSessionPatch(reviewStage)); }, [patchSession, reviewStage]);
  const stage = session.phase === "REPLAY_S1" ? "S1" : session.phase === "REPLAY_S2" ? "S2" : session.phase === "ANALYSIS" ? "ANALYSIS" : "PREP";
  const displayAnchors = stage === "ANALYSIS" ? M1_PLAYCANVAS_DISPLAY_ANCHORS.analysis : M1_PLAYCANVAS_DISPLAY_ANCHORS.replay;
  const handleInteract = useCallback((station: StationId) => {
    if (station === "SIBAL" && stage === "PREP") { patchSession({ phase: "REPLAY_S1", activeObjective: "INSPECT S1 RUN", activePanel: null }); setMessage("EMBER · SIBAL sample identified. Replay chamber access granted."); return; }
    if (station === "S1" && stage === "S1") { markStationReviewed("S1"); patchSession({ phase: "REPLAY_S2", activeObjective: "INSPECT S2 RUN", activePanel: "S1" }); setActivePanel("S1"); setMessage("EMBER · S1 recorded. Review the opposed-flow run."); return; }
    if (station === "S2" && stage === "S2") { markStationReviewed("S2"); patchSession({ phase: "ANALYSIS", activeObjective: "PROCEED TO ANALYSIS BAY", activePanel: "S2" }); setActivePanel("S2"); setMessage("EMBER · S2 recorded. Comparison ready."); return; }
    if (station === "ANALYSIS" && stage === "ANALYSIS") { patchSession({ activeObjective: "REVIEW SOURCE COMPARISON", activePanel: "ANALYSIS" }); setActivePanel("ANALYSIS"); setMessage("EMBER · Source comparison is ready for review."); }
  }, [markStationReviewed, patchSession, stage]);
  const objective = stage === "PREP" ? "INSPECT THE SIBAL SAMPLE" : stage === "S1" ? "INSPECT S1 RUN" : stage === "S2" ? "INSPECT S2 RUN" : "REVIEW SOURCE COMPARISON";
  const location = stage === "PREP" ? "PREPARATION BAY · E — INTERACT" : stage === "S1" ? "REPLAY CHAMBER · S1 CONCURRENT" : stage === "S2" ? "REPLAY CHAMBER · S2 OPPOSED" : "ANALYSIS BAY · E — REVIEW";
  return <div className="playcanvas-pilot"><Application fillMode={FILLMODE_FILL_WINDOW} resolutionMode={RESOLUTION_AUTO} graphicsDeviceOptions={{ antialias: true, alpha: false }}><PilotScene session={{ ...session, activePanel }} reviewStage={reviewStage} cameraRef={cameraRef} onInteract={handleInteract} /><WorldProjection cameraRef={cameraRef} displays={[{ ref: s1Ref, position: displayAnchors.s1 }, { ref: s2Ref, position: displayAnchors.s2 }, { ref: headerRef, position: displayAnchors.header }, { ref: limitRef, position: displayAnchors.limit }]} /></Application><div className="playcanvas-hud" aria-label="M1 PlayCanvas pilot HUD"><div className="playcanvas-objective"><span>M1 · {m1Mission.title}</span><strong>{objective}</strong><small>{location}</small></div><div className="playcanvas-crosshair">·</div><div className="playcanvas-ember">{message}</div><ProjectedEvidence stage={stage} activePanel={activePanel} s1Ref={s1Ref} s2Ref={s2Ref} headerRef={headerRef} limitRef={limitRef} /></div></div>;
}
