"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Application, Container, Entity } from "@playcanvas/react";
import { Camera, Light, Render } from "@playcanvas/react/components";
import { useApp, useModel } from "@playcanvas/react/hooks";
import { Color, FILLMODE_FILL_WINDOW, Ray, RESOLUTION_AUTO, StandardMaterial, Vec3, type AnimTrack, type Entity as PcEntity } from "playcanvas";
import { m6Mission } from "@/data/missions/m6-locked-door";
import { M6_STORAGE_KEY, createM6State, m6Candidates, parseM6State, type M6State } from "@/lib/m6-state";
import { useMissionSession, type MissionSessionState } from "@/lib/mission-session";
import { M6_REVIEW_CAMERA, M6_REVIEW_HIDDEN_NODES, M6_REVIEW_LAYOUT, M6_REVIEW_MODULES, m6ReviewSessionPatch, type M6PlayCanvasStage, type M6ReviewCameraPreset } from "@/lib/m6-playcanvas";

const visualVariants = new Set(["gravifire_corridor_4m.glb", "gravifire_lab_shell_8x8.glb", "gravifire_bulkhead_door.glb", "gravifire_equipment_rack.glb", "gravifire_science_console.glb", "gravifire_analysis_wall.glb"]);
const GENERATED_ROOT = "/assets/game/generated/m1/";
const CHARACTER_ASSET = "/assets/game/character/quaternius-human-astronaut.glb";
const CLIPS = { IDLE: "CharacterArmature|Idle", WALK: "CharacterArmature|Walk", RUN: "CharacterArmature|Run" } as const;
type ReviewStage = "manifest" | "evidence" | "airlock" | "boundary" | "refusal" | undefined;
type DisplayGetter = () => HTMLDivElement | null;

function AssetModule({ file, position, rotation = [0, 0, 0], scale = 1, hideNodes = [], onClick }: { file: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number; hideNodes?: string[]; onClick?: () => void }) {
  const { asset, error } = useModel(`${visualVariants.has(file) ? "/assets/game/generated/m0/" : GENERATED_ROOT}${file}`);
  const entityRef = useRef<PcEntity | null>(null);
  useEffect(() => { if (error && process.env.NODE_ENV !== "production") console.warn(`[PlayCanvas M6] asset failed: ${file}`, error); }, [error, file]);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !asset) return;
    const resource = asset.resource as PcEntity & { findByName?: (name: string) => PcEntity | null; meshInstances?: Array<{ aabb?: { center?: { x: number; y: number; z: number }; halfExtents?: { x: number; y: number; z: number } } }> };
    const mountedRoot = entityRef.current as (PcEntity & { findByName?: (name: string) => PcEntity | null }) | null;
    const hidden = hideNodes.map((name) => {
      const node = mountedRoot?.findByName?.(name) ?? resource.findByName?.(name);
      if (node) node.enabled = false;
      return { name, found: Boolean(node) };
    });
    const boxes = resource.meshInstances?.map((mesh) => mesh.aabb).filter(Boolean).slice(0, 3).map((box) => ({ center: box?.center, halfExtents: box?.halfExtents }));
    console.debug(`[PlayCanvas M6] mounted ${file}`, { entity: `m6-${file}`, position, scale, localBounds: boxes, hidden });
  }, [asset, file, hideNodes, position, scale]);
  if (!asset) return null;
  return <Entity ref={entityRef} name={`m6-${file}`} position={position} rotation={rotation} scale={[scale, scale, scale]} onClick={onClick}><Container asset={asset} /></Entity>;
}

function Character({ playerRef, clip, onReady }: { playerRef: MutableRefObject<PcEntity | null>; clip: string; onReady: (ready: boolean) => void }) {
  const { asset, error } = useModel(CHARACTER_ASSET);
  useEffect(() => { if (error && process.env.NODE_ENV !== "production") console.warn("[PlayCanvas M6] character asset failed", error); onReady(Boolean(asset && !error)); }, [asset, error, onReady]);
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
  return <Entity name="m6-human-mission-engineer" ref={playerRef} position={[0, 0, 1.15]} rotation={[0, 180, 0]} scale={[0.86, 0.86, 0.86]}><Render type="asset" asset={asset} castShadows receiveShadows /></Entity>;
}

function FallbackCharacter({ playerRef, material, darkMaterial }: { playerRef: MutableRefObject<PcEntity | null>; material: StandardMaterial; darkMaterial: StandardMaterial }) {
  return <Entity name="m6-procedural-fallback-character" ref={playerRef} position={[0, 0, 1.15]}><Entity name="fallback-torso" position={[0, 1.05, 0]} scale={[0.62, 0.85, 0.36]}><Render type="box" material={material} /></Entity><Entity name="fallback-helmet" position={[0, 1.85, 0]} scale={[0.34, 0.34, 0.34]}><Render type="sphere" material={darkMaterial} /></Entity><Entity name="fallback-pack" position={[0, 1.15, 0.38]} scale={[0.38, 0.58, 0.18]}><Render type="box" material={darkMaterial} /></Entity><Entity name="fallback-left-leg" position={[-0.2, 0.38, 0]} scale={[0.18, 0.62, 0.2]}><Render type="capsule" material={darkMaterial} /></Entity><Entity name="fallback-right-leg" position={[0.2, 0.38, 0]} scale={[0.18, 0.62, 0.2]}><Render type="capsule" material={darkMaterial} /></Entity></Entity>;
}

function Controller({ playerRef, cameraRef, initialPosition, cameraPreset, onInteract, onMovementState }: { playerRef: MutableRefObject<PcEntity | null>; cameraRef: MutableRefObject<PcEntity | null>; initialPosition: { x: number; z: number }; cameraPreset?: M6ReviewCameraPreset; onInteract: (position: { x: number; z: number }) => void; onMovementState: (state: keyof typeof CLIPS) => void }) {
  const app = useApp();
  const state = useRef({ x: initialPosition.x, z: initialPosition.z, yaw: cameraPreset?.yaw ?? 0, pitch: cameraPreset?.pitch ?? 8, lastMovement: "IDLE" as keyof typeof CLIPS, keys: new Set<string>() });
  useEffect(() => {
    const canvas = app.graphicsDevice.canvas;
    const paused = { value: false };
    const onPause = (event: Event) => { paused.value = Boolean((event as CustomEvent<boolean>).detail); if (paused.value) state.current.keys.clear(); };
    const down = (event: KeyboardEvent) => { if (paused.value) return; state.current.keys.add(event.key.toLowerCase()); if (["w", "a", "s", "d", "shift"].includes(event.key.toLowerCase())) event.preventDefault(); if (event.key.toLowerCase() === "e") onInteract({ x: state.current.x, z: state.current.z }); };
    const up = (event: KeyboardEvent) => state.current.keys.delete(event.key.toLowerCase());
    const move = (event: PointerEvent) => { if (document.pointerLockElement !== canvas) return; state.current.yaw -= event.movementX * 0.08; state.current.pitch = Math.max(2, Math.min(24, state.current.pitch - event.movementY * 0.05)); };
    const lock = () => canvas.requestPointerLock?.();
    const update = (dt: number) => {
      if (paused.value) return;
      const s = state.current; const forward = Number(s.keys.has("w")) - Number(s.keys.has("s")); const strafe = Number(s.keys.has("d")) - Number(s.keys.has("a")); const speed = s.keys.has("shift") ? 3.6 : 2.25; const movement = forward || strafe ? (s.keys.has("shift") ? "RUN" : "WALK") : "IDLE";
      if (movement !== s.lastMovement) { s.lastMovement = movement; onMovementState(movement); }
      const angle = s.yaw * Math.PI / 180; const moveX = Math.cos(angle) * strafe - Math.sin(angle) * forward; const moveZ = -Math.cos(angle) * forward - Math.sin(angle) * strafe;
      s.x = Math.max(-3.3, Math.min(3.3, s.x + moveX * speed * dt)); s.z = Math.max(-20.6, Math.min(3.1, s.z + moveZ * speed * dt));
      const player = playerRef.current; const camera = cameraRef.current; if (!player || !camera) return; player.setPosition(s.x, 0, s.z); if (forward || strafe) player.setEulerAngles(0, Math.atan2(moveX, moveZ) * 180 / Math.PI, 0);
      const distance = cameraPreset?.distance ?? (s.keys.has("shift") ? 3.1 : 2.8); const shoulderX = Math.cos(angle) * 0.58; const shoulderZ = -Math.sin(angle) * 0.58; const backX = Math.sin(angle) * distance; const backZ = Math.cos(angle) * distance; const targetHeight = cameraPreset?.targetHeight ?? 1.18; const lookAhead = cameraPreset?.lookAhead ?? 0.42; const target = { x: s.x - Math.sin(angle) * lookAhead, y: targetHeight, z: s.z - Math.cos(angle) * lookAhead }; camera.setPosition(s.x + shoulderX + backX, 1.72 + Math.sin(s.pitch * Math.PI / 180) * 0.42, s.z + shoulderZ + backZ); camera.lookAt(target.x, target.y, target.z);
    };
    app.on("update", update); window.addEventListener("mission-pause", onPause); window.addEventListener("keydown", down); window.addEventListener("keyup", up); window.addEventListener("pointermove", move); canvas.addEventListener("click", lock);
    return () => { app.off("update", update); window.removeEventListener("mission-pause", onPause); window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("pointermove", move); canvas.removeEventListener("click", lock); };
  }, [app, cameraPreset, cameraRef, initialPosition.x, initialPosition.z, onInteract, onMovementState, playerRef]);
  return null;
}

function WorldProjection({ cameraRef, displays }: { cameraRef: MutableRefObject<PcEntity | null>; displays: Array<{ getElement: DisplayGetter; position: readonly [number, number, number] }> }) {
  const app = useApp();
  useEffect(() => { const canvas = app.graphicsDevice.canvas; const update = () => { const camera = cameraRef.current?.camera; if (!camera) return; displays.forEach(({ getElement, position }) => { const element = getElement(); if (!element) return; const point = camera.worldToScreen(new Vec3(position[0], position[1], position[2])); const visible = point.z > 0 && point.x > -80 && point.x < canvas.clientWidth + 80 && point.y > -80 && point.y < canvas.clientHeight + 80; element.style.display = visible ? "grid" : "none"; if (visible) { element.style.left = `${point.x}px`; element.style.top = `${point.y}px`; } }); }; app.on("update", update); update(); return () => { app.off("update", update); }; }, [app, cameraRef, displays]);
  return null;
}

type DiagnosticNode = PcEntity & { children: DiagnosticNode[]; render?: { meshInstances?: Array<{ aabb?: { center?: { x: number; y: number; z: number }; halfExtents?: { x: number; y: number; z: number }; intersectsRay?: (ray: Ray) => boolean }; material?: { name?: string } }> }; collision?: unknown; rigidbody?: unknown };

function ReviewDiagnostics({ cameraRef, playerRef, stage, anchor }: { cameraRef: MutableRefObject<PcEntity | null>; playerRef: MutableRefObject<PcEntity | null>; stage: M6PlayCanvasStage; anchor: readonly [number, number, number] }) {
  const app = useApp();
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const timer = window.setTimeout(() => {
      const camera = cameraRef.current?.camera;
      if (!camera) return;
      const cameraPosition = camera.entity.getPosition();
      const target = new Vec3(anchor[0], anchor[1], anchor[2]);
      const rows: Array<Record<string, unknown>> = [];
      const walk = (node: DiagnosticNode, path: string) => {
        if (node.enabled && node.render?.meshInstances?.length) {
          node.render.meshInstances.forEach((mesh, index) => {
            const box = mesh.aabb;
            rows.push({ entity: node.name, path: `${path}/${node.name}`, mesh: index, worldPosition: node.getPosition(), worldRotation: node.getEulerAngles(), worldScale: node.getScale(), worldAABB: box ? { center: box.center, halfExtents: box.halfExtents } : null, material: mesh.material?.name ?? "unnamed", enabled: node.enabled, collidable: Boolean(node.collision || node.rigidbody), classification: node.name.includes("screen") ? "SCREEN_BACKING" : node.name.includes("shell") || node.name.includes("corridor") ? "ROOM_STRUCTURE" : node.name.includes("bulkhead") ? "DOOR_BULKHEAD" : "PROP" });
          });
        }
        node.children?.forEach((child) => walk(child as unknown as DiagnosticNode, `${path}/${node.name}`));
      };
      walk(app.root as unknown as DiagnosticNode, "");
      const firstHits = (rayTo: Vec3) => rows
        .map((row) => {
          const box = row.worldAABB as { center?: { x: number; y: number; z: number } } | null | undefined;
          return { row, distance: box?.center ? new Vec3(box.center.x, box.center.y, box.center.z).distance(cameraPosition) : Number.POSITIVE_INFINITY };
        })
        .filter(({ row }) => {
          const node = app.root.findByName(String(row.entity)) as unknown as DiagnosticNode | null;
          return Boolean(node?.render?.meshInstances?.some((mesh) => mesh.aabb?.intersectsRay?.(new Ray(cameraPosition.clone(), rayTo.clone().sub(cameraPosition).normalize()))));
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
      const playerTarget = playerRef.current?.getPosition() ?? new Vec3(0, 1.15, 0);
      const rayHits = {
        player: firstHits(playerTarget),
        anchor: firstHits(target),
        roomCenter: firstHits(new Vec3(0, 1.2, stage === "AIRLOCK" ? -12 : stage === "BOUNDARY" ? -20 : -8)),
      };
      const screenPoints = [
        [app.graphicsDevice.canvas.clientWidth / 2, app.graphicsDevice.canvas.clientHeight / 2],
        [app.graphicsDevice.canvas.clientWidth / 4, app.graphicsDevice.canvas.clientHeight / 2],
        [app.graphicsDevice.canvas.clientWidth * 0.75, app.graphicsDevice.canvas.clientHeight / 2],
      ].map(([x, y]) => ({ x, y, near: camera.screenToWorld(x, y, camera.nearClip), far: camera.screenToWorld(x, y, camera.farClip) }));
      const playerPoint = playerRef.current ? camera.worldToScreen(playerRef.current.getPosition()) : null;
      const anchorPoint = camera.worldToScreen(target);
      const inFrustum = (point: Vec3 | null) => Boolean(point && point.z > 0 && point.x >= 0 && point.x <= app.graphicsDevice.canvas.clientWidth && point.y >= 0 && point.y <= app.graphicsDevice.canvas.clientHeight);
      console.groupCollapsed(`[PlayCanvas M6] ${stage} review diagnostics`);
      console.debug("review modules", M6_REVIEW_MODULES[stage.toLowerCase() as keyof typeof M6_REVIEW_MODULES]);
      console.debug("camera", cameraPosition, "player-target", target, "ray hits", rayHits);
      console.debug("visible render entities", rows);
      console.debug("screen-center pick rays", screenPoints);
      console.debug("frustum", { astronaut: playerPoint, astronautVisible: inFrustum(playerPoint), anchor: anchorPoint, anchorVisible: inFrustum(anchorPoint) });
      (window as Window & { __GRAVIFIRE_M6_REVIEW_DIAGNOSTICS__?: unknown }).__GRAVIFIRE_M6_REVIEW_DIAGNOSTICS__ = { stage, cameraPosition, rayHits, rows, playerPoint, anchorPoint };
      console.groupEnd();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [app, anchor, cameraRef, playerRef, stage]);
  return null;
}

function ScreenSurface({ position, scale, material, name = "m6-screen" }: { position: [number, number, number]; scale: [number, number, number]; material: StandardMaterial; name?: string }) { return <Entity name={name} position={position} scale={scale}><Render type="box" material={material} /></Entity>; }

function Scene({ session, reviewStage, cameraRef, onInteract }: { session: MissionSessionState; reviewStage?: ReviewStage; cameraRef: MutableRefObject<PcEntity | null>; onInteract: (id: string) => void }) {
  const playerRef = useRef<PcEntity | null>(null); const [clip, setClip] = useState<keyof typeof CLIPS>("IDLE"); const [ready, setReady] = useState(false);
  const suit = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.74, 0.78, 0.76); material.update(); return material; }, []);
  const darkSuit = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.06, 0.08, 0.09); material.update(); return material; }, []);
  const screen = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.03, 0.07, 0.075); material.emissive = new Color(0.012, 0.025, 0.025); material.update(); return material; }, []);
  const amberScreen = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.16, 0.09, 0.03); material.emissive = new Color(0.055, 0.018, 0.004); material.update(); return material; }, []);
  const stage = session.phase === "EVIDENCE" ? "EVIDENCE" : session.phase === "AIRLOCK" ? "AIRLOCK" : session.phase === "BOUNDARY" ? "BOUNDARY" : session.phase === "REFUSAL" ? "REFUSAL" : "MANIFEST" as M6PlayCanvasStage;
  const layout = reviewStage === "evidence" ? M6_REVIEW_LAYOUT.evidence : reviewStage === "airlock" ? M6_REVIEW_LAYOUT.airlock : reviewStage === "boundary" ? M6_REVIEW_LAYOUT.boundary : reviewStage === "refusal" ? M6_REVIEW_LAYOUT.refusal : M6_REVIEW_LAYOUT.manifest;
  const reviewCamera = reviewStage ? M6_REVIEW_CAMERA[reviewStage] : undefined;
  const initialPosition = layout.spawn;
  const targetAtPosition = useCallback((position: { x: number; z: number }) => {
    const targets: Record<M6PlayCanvasStage, { id: string; x: number; z: number }> = { MANIFEST: { id: "manifest", x: 0, z: -0.25 }, EVIDENCE: { id: "evidence", x: 0, z: -7.85 }, AIRLOCK: { id: "airlock", x: 0, z: -12.05 }, BOUNDARY: { id: "boundary", x: 0, z: -20.05 }, REFUSAL: { id: "refusal", x: 0, z: -20.05 } };
    const target = targets[stage]; if (Math.hypot(position.x - target.x, position.z - target.z) < 2.25) onInteract(target.id);
  }, [onInteract, stage]);
  const review = Boolean(reviewStage);
  const diagnosticAnchor = stage === "MANIFEST" ? M6_REVIEW_LAYOUT.manifest.anchors[1] : stage === "EVIDENCE" ? M6_REVIEW_LAYOUT.evidence.anchors[1] : stage === "AIRLOCK" ? M6_REVIEW_LAYOUT.airlock.anchor : stage === "BOUNDARY" ? M6_REVIEW_LAYOUT.boundary.anchor : M6_REVIEW_LAYOUT.refusal.anchor;
  const showEvidenceInstallation = !review || stage === "EVIDENCE";
  const showBoundaryAnalysisWall = !review || stage === "REFUSAL";
  return <><Entity name="m6-camera" ref={cameraRef} position={[0.58, 1.72, 4.3]}><Camera fov={64} nearClip={0.05} farClip={85} clearColor="#080c0e" /></Entity><Entity name="m6-key-light" rotation={[35, -25, 0]}><Light type="directional" intensity={1.4} color="#e7edf2" castShadows shadowBias={0.25} normalOffsetBias={0.08} shadowDistance={28} /></Entity><Entity name="m6-ambient-light" position={[0, 3, -8]}><Light type="omni" intensity={stage === "EVIDENCE" ? 1.8 : stage === "AIRLOCK" ? 1.45 : stage === "BOUNDARY" || stage === "REFUSAL" ? 1.35 : 1.15} range={22} color="#a8c1c4" /></Entity><Entity name="m6-industrial-fill" position={[0, 2.7, -16.5]}><Light type="omni" intensity={stage === "AIRLOCK" || stage === "BOUNDARY" || stage === "REFUSAL" ? 1.05 : 0.55} range={12} color="#b1c5c8" /></Entity><Entity name="m6-amber-transition" position={[0, 2.5, -12.1]}><Light type="omni" intensity={stage === "MANIFEST" || stage === "EVIDENCE" ? 0.35 : 1.0} range={7} color="#e3a65c" /></Entity><Entity name="m6-boundary-light" position={[0, 2.6, -20.2]}><Light type="omni" intensity={stage === "BOUNDARY" || stage === "REFUSAL" ? 1.45 : 0.45} range={8} color="#e0a15b" /></Entity>
    {review ? stage === "MANIFEST" ? <><AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, 0]} /><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -4.15]} /></> : stage === "EVIDENCE" ? <AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, -8.35]} hideNodes={["wall_south_l", "wall_south_r"]} /> : stage === "AIRLOCK" ? <><AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, -8.35]} hideNodes={[...M6_REVIEW_HIDDEN_NODES.airlock]} /><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -12.5]} scale={1.08} hideNodes={["ceiling_light"]} /><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -16.7]} scale={1.08} hideNodes={["ceiling_light"]} /></> : <><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -16.7]} scale={1.08} hideNodes={[...M6_REVIEW_HIDDEN_NODES.boundary]} /><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -20.85]} hideNodes={[...M6_REVIEW_HIDDEN_NODES.boundary]} /></> : <><AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, 0]} /><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -4.15]} /><AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, -8.35]} /><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -12.5]} /><AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, -16.7]} /><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -20.85]} /></>}
    {(!review || stage === "MANIFEST") && <><AssetModule file="gravifire_science_console.glb" position={[-2.35, 0, -0.25]} onClick={() => onInteract("manifest")} /><AssetModule file="gravifire_science_console.glb" position={[0, 0, -0.25]} onClick={() => onInteract("manifest")} /><AssetModule file="gravifire_science_console.glb" position={[2.35, 0, -0.25]} onClick={() => onInteract("manifest")} /><AssetModule file="gravifire_equipment_rack.glb" position={[-3.2, 0, 1.0]} rotation={[0, Math.PI / 2, 0]} /><AssetModule file="gravifire_analysis_wall.glb" position={[0, 0, -1.85]} scale={0.82} /><ScreenSurface name="m6-manifest-screen" position={[0, 1.55, -2.05]} scale={[1.8, 0.62, 0.03]} material={screen} /></>}
    {showEvidenceInstallation && <><AssetModule file="gravifire_equipment_rack.glb" position={[-3.15, 0, -7.45]} rotation={[0, Math.PI / 2, 0]} /><AssetModule file="gravifire_science_console.glb" position={[-2.2, 0, -7.85]} onClick={() => onInteract("evidence")} /><AssetModule file="gravifire_science_console.glb" position={[0, 0, -7.85]} onClick={() => onInteract("evidence")} /><AssetModule file="gravifire_science_console.glb" position={[2.2, 0, -7.85]} onClick={() => onInteract("evidence")} /><ScreenSurface name="m6-evidence-screen" position={[0, 1.42, -8.1]} scale={[3.2, 0.72, 0.03]} material={screen} /></>}
    {!review || stage !== "AIRLOCK" ? <AssetModule file="gravifire_bulkhead_door.glb" position={[0, 0, -11.85]} scale={1.15} onClick={() => onInteract("airlock")} /> : null}{review && stage === "AIRLOCK" && <ScreenSurface name="m6-airlock-signage" position={[0, 1.92, -11.82]} scale={[1.2, 0.28, 0.025]} material={amberScreen} />}{(!review || (stage !== "AIRLOCK" && stage !== "BOUNDARY")) && <><AssetModule file="gravifire_equipment_rack.glb" position={[-3.15, 0, -14.25]} rotation={[0, Math.PI / 2, 0]} /><AssetModule file="gravifire_equipment_rack.glb" position={[3.15, 0, -16.2]} rotation={[0, -Math.PI / 2, 0]} /></>}{!review && <AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -16.7]} scale={1.08} />}
    <AssetModule file="gravifire_bulkhead_door.glb" position={[0, 0, -20.15]} scale={1.55} onClick={() => onInteract("boundary")} />{(!review || stage === "REFUSAL") && <><AssetModule file="gravifire_equipment_rack.glb" position={[-3.15, 0, -19.75]} rotation={[0, Math.PI / 2, 0]} /><AssetModule file="gravifire_equipment_rack.glb" position={[3.15, 0, -19.75]} rotation={[0, -Math.PI / 2, 0]} /></>}{showBoundaryAnalysisWall && <AssetModule file="gravifire_analysis_wall.glb" position={[0, 0, -19.55]} scale={0.9} />}<ScreenSurface name="m6-boundary-screen" position={[0, 1.72, -20.38]} scale={[3.15, 1.08, 0.035]} material={amberScreen} /><AssetModule file="gravifire_science_console.glb" position={[2.55, 0, -19.65]} scale={1.1} onClick={() => onInteract("refusal")} /><ScreenSurface name="m6-memo-screen" position={[2.55, 1.38, -19.92]} scale={[1.45, 0.78, 0.03]} material={screen} />
    <Character playerRef={playerRef} clip={CLIPS[clip]} onReady={setReady} />{!ready && <FallbackCharacter playerRef={playerRef} material={suit} darkMaterial={darkSuit} />}<Controller playerRef={playerRef} cameraRef={cameraRef} initialPosition={initialPosition} cameraPreset={reviewCamera} onInteract={targetAtPosition} onMovementState={setClip} /><ReviewDiagnostics cameraRef={cameraRef} playerRef={playerRef} stage={stage} anchor={diagnosticAnchor} />
  </>;
}

function ProjectedM6Evidence({ stage, m6, setDisplayRef }: { stage: M6PlayCanvasStage; m6: M6State; setDisplayRef: (id: string) => (element: HTMLDivElement | null) => void }) {
  const refusal = m6Mission.verdictDefinitions[0];
  const selected = m6.manifest.map((slot) => slot.options.find((option) => option.id === slot.selectedOptionId)?.material).filter(Boolean).join(" / ") || "MANIFEST PENDING";
  if (stage === "MANIFEST") return <><div ref={setDisplayRef("manifest")} className="playcanvas-projected-header"><span>AEGIS-1 MISSION MANIFEST</span><strong>MISSION CONDITIONS</strong><small>{m6Mission.storyContext.habitatCondition} · {m6Mission.storyContext.gravity}</small></div></>;
  if (stage === "EVIDENCE") return <><div ref={setDisplayRef("evidence")} className="playcanvas-projected-header playcanvas-m6-evidence-display"><span>EVIDENCE ASSEMBLY</span><strong>KNOWN / BOUND / MISSING MATCH</strong><small>{selected}</small><em>{m6.manifest.map((slot) => `${slot.label}: ${slot.options.find((option) => option.id === slot.selectedOptionId)?.evidenceState ?? "PENDING"}`).join(" · ")}</em></div></>;
  if (stage === "AIRLOCK") return <div ref={setDisplayRef("airlock")} className="playcanvas-projected-header"><span>TRANSITION AIRLOCK</span><strong>EXPLORATION SECTION</strong><small>FICTIONAL MISSION ENVIRONMENT</small></div>;
  if (stage === "BOUNDARY") return <><div ref={setDisplayRef("boundary")} className="playcanvas-projected-monitor playcanvas-projected-monitor--s2"><span>MARS HABITAT CONDITION</span><strong>{m6Mission.storyContext.gravity}</strong><small>CURRENT EVIDENCE REVIEW</small><em>MATCHING COMBINED CONDITION: NOT FOUND IN CURRENT GRAVIFIRE ARCHIVE</em></div></>;
  return <><div ref={setDisplayRef("refusal")} className="playcanvas-projected-monitor playcanvas-projected-monitor--s2 playcanvas-m6-refusal-display"><span>VERDICT</span><strong>REFUSAL</strong><small>{refusal.conclusion}</small><em>{refusal.namedGap}</em></div><div ref={setDisplayRef("memo")} className="playcanvas-projected-header playcanvas-m6-memo-display"><span>EXPERIMENT MEMO</span><strong>{m6Candidates.length} EVIDENCE QUESTIONS</strong><small>{m6Candidates[0].question}</small><em>MISSING: {m6Candidates[0].missingDimensions.join(" · ")}</em></div></>;
}

export default function PlayCanvasM6Pilot({ reviewStage }: { reviewStage?: ReviewStage }) {
  const { session, patchSession } = useMissionSession("m6-playcanvas"); const [m6, setM6] = useState<M6State>(() => createM6State()); const [message, setMessage] = useState("EMBER · Mission conditions loaded."); const cameraRef = useRef<PcEntity | null>(null); const displayElements = useMemo(() => new Map<string, HTMLDivElement>(), []);
  const setDisplayRef = useCallback((id: string) => (element: HTMLDivElement | null) => { if (element) displayElements.set(id, element); else displayElements.delete(id); }, [displayElements]);
  useEffect(() => { const timer = window.setTimeout(() => { const stored = window.localStorage.getItem(M6_STORAGE_KEY); if (reviewStage) { patchSession(m6ReviewSessionPatch(reviewStage)); return; } setM6(parseM6State(stored)); }, 0); return () => window.clearTimeout(timer); }, [patchSession, reviewStage]);
  const stage: M6PlayCanvasStage = session.phase === "EVIDENCE" ? "EVIDENCE" : session.phase === "AIRLOCK" ? "AIRLOCK" : session.phase === "BOUNDARY" ? "BOUNDARY" : session.phase === "REFUSAL" ? "REFUSAL" : "MANIFEST";
  const persistM6 = useCallback((next: M6State) => { setM6(next); if (!reviewStage) window.localStorage.setItem(M6_STORAGE_KEY, JSON.stringify(next)); }, [reviewStage]);
  const handleInteract = useCallback((id: string) => {
    if (id === "manifest" && stage === "MANIFEST") { const next = { ...m6, manifest: m6.manifest.map((slot) => ({ ...slot, selectedOptionId: slot.selectedOptionId ?? slot.options[0]?.id })) }; persistM6(next); patchSession({ phase: "EVIDENCE", activeObjective: "ASSEMBLE EVIDENCE", reviewedStations: ["MANIFEST"] }); setMessage("EMBER · Manifest conditions loaded. Review the evidence boundary."); }
    else if (id === "evidence" && stage === "EVIDENCE") { patchSession({ phase: "AIRLOCK", activeObjective: "ENTER EXPLORATION SECTION", reviewedStations: ["MANIFEST", "EVIDENCE"] }); setMessage("EMBER · Relevant evidence is assembled. The combined condition remains unmatched."); }
    else if (id === "airlock" && stage === "AIRLOCK") { patchSession({ phase: "BOUNDARY", activeObjective: "SCAN MARS BOUNDARY", reviewedStations: ["MANIFEST", "EVIDENCE", "AIRLOCK"] }); setMessage("EMBER · Proceed to the Mars habitat boundary."); }
    else if (id === "boundary" && stage === "BOUNDARY") { const next = { ...m6, refusal: true }; persistM6(next); patchSession({ phase: "REFUSAL", activeObjective: "REVIEW REFUSAL", reviewedStations: ["MANIFEST", "EVIDENCE", "AIRLOCK", "BOUNDARY"] }); setMessage("EMBER · No matching combined condition is present in the current archive."); }
    else if (id === "refusal" && stage === "REFUSAL") setMessage("EMBER · I cannot produce a supported verdict outside the current evidence domain.");
  }, [m6, patchSession, persistM6, stage]);
  const projected = stage === "MANIFEST" ? [{ getElement: () => displayElements.get("manifest") ?? null, position: M6_REVIEW_LAYOUT.manifest.anchors[1] }] : stage === "EVIDENCE" ? [{ getElement: () => displayElements.get("evidence") ?? null, position: M6_REVIEW_LAYOUT.evidence.anchors[1] }] : stage === "AIRLOCK" ? [{ getElement: () => displayElements.get("airlock") ?? null, position: M6_REVIEW_LAYOUT.airlock.anchor }] : stage === "BOUNDARY" ? [{ getElement: () => displayElements.get("boundary") ?? null, position: M6_REVIEW_LAYOUT.boundary.anchor }] : [{ getElement: () => displayElements.get("refusal") ?? null, position: M6_REVIEW_LAYOUT.refusal.anchor }, { getElement: () => displayElements.get("memo") ?? null, position: M6_REVIEW_LAYOUT.refusal.memo }];
  const objective = stage === "MANIFEST" ? "REVIEW MISSION MANIFEST" : stage === "EVIDENCE" ? "ASSEMBLE EVIDENCE" : stage === "AIRLOCK" ? "ENTER EXPLORATION SECTION" : stage === "BOUNDARY" ? "SCAN MARS BOUNDARY" : "REVIEW REFUSAL / LOG NEXT EXPERIMENT";
  const location = stage === "MANIFEST" ? "MISSION MANIFEST ROOM" : stage === "EVIDENCE" ? "EVIDENCE ASSEMBLY BAY" : stage === "AIRLOCK" ? "TRANSITION AIRLOCK" : stage === "BOUNDARY" ? "MARS BOUNDARY DOOR" : "REFUSAL / EXPERIMENT MEMO";
  return <div className="playcanvas-pilot"><Application fillMode={FILLMODE_FILL_WINDOW} resolutionMode={RESOLUTION_AUTO} graphicsDeviceOptions={{ antialias: true, alpha: false }}><Scene session={session} reviewStage={reviewStage} cameraRef={cameraRef} onInteract={handleInteract} /><WorldProjection cameraRef={cameraRef} displays={projected} /></Application><div className="playcanvas-hud" aria-label="M6 PlayCanvas HUD"><div className="playcanvas-objective"><span>M6 · {m6Mission.title}</span><strong>{objective}</strong><small>{location}</small></div><div className="playcanvas-crosshair">·</div><div className="playcanvas-ember">{message}</div><ProjectedM6Evidence stage={stage} m6={m6} setDisplayRef={setDisplayRef} /></div></div>;
}
