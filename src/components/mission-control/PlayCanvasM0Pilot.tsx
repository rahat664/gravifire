"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { useRouter } from "next/navigation";
import { Application, Container, Entity } from "@playcanvas/react";
import { Camera, Light, Render } from "@playcanvas/react/components";
import { useApp, useModel } from "@playcanvas/react/hooks";
import { BLEND_NORMAL, CULLFACE_NONE, Color, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO, SEMANTIC_POSITION, SEMANTIC_TEXCOORD0, ShaderMaterial, StandardMaterial, Vec3, type AnimTrack, type Entity as PcEntity } from "playcanvas";
import M0InteriorDetails from "@/components/mission-control/M0InteriorDetails";
import { campaignMissions } from "@/data/missions";
import { m0Mission } from "@/data/missions/m0-two-seconds-of-smoke";
import { addDecision, addGap, beginM0, CAMPAIGN_STORAGE_KEY, completeMission, createInitialCampaign, parseCampaignState, serializeCampaignState, setM0Decision, unlockManual } from "@/lib/mission-state";
import type { CampaignState, MissionBeat } from "@/features/mission-control/types";
import { useMissionSession, type MissionSessionState } from "@/lib/mission-session";
import { M0_REVIEW_LAYOUT, m0ReviewLayout, type M0PlayCanvasStage } from "@/lib/m0-playcanvas";

const GENERATED_ROOT = "/assets/game/generated/m0/";
const CHARACTER_ASSET = "/assets/game/character/quaternius-human-astronaut.glb";
const CLIPS = { IDLE: "CharacterArmature|Idle", WALK: "CharacterArmature|Walk", RUN: "CharacterArmature|Run" } as const;
type ReviewStage = "corridor" | "incident" | "response" | "archive" | undefined;
type M0Station = "incident" | "heater" | "garment" | "vent" | "vent-cut" | "vent-increase" | "suppression" | "archive";

function AssetModule({ file, position, rotation = [0, 0, 0], scale = 1, onClick }: { file: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number; onClick?: () => void }) {
  const { asset, error } = useModel(`${GENERATED_ROOT}${file}`);
  useEffect(() => { if (error && process.env.NODE_ENV !== "production") console.warn(`[PlayCanvas M0] asset failed: ${file}`, error); }, [error, file]);
  if (!asset) return null;
  return <Entity name={`m0-${file}`} position={position} rotation={rotation} scale={[scale, scale, scale]} onClick={onClick}><Container asset={asset} /></Entity>;
}

function Character({ playerRef, clip, onReady }: { playerRef: MutableRefObject<PcEntity | null>; clip: string; onReady: (ready: boolean) => void }) {
  const { asset, error } = useModel(CHARACTER_ASSET);
  useEffect(() => { if (error && process.env.NODE_ENV !== "production") console.warn("[PlayCanvas M0] character asset failed", error); onReady(Boolean(asset && !error)); }, [asset, error, onReady]);
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
  return <Entity name="m0-human-mission-engineer" ref={playerRef} position={[0, 0, 1.15]} rotation={[0, 180, 0]} scale={[0.86, 0.86, 0.86]}><Render type="asset" asset={asset} castShadows receiveShadows /></Entity>;
}

function FallbackCharacter({ playerRef, material, darkMaterial }: { playerRef: MutableRefObject<PcEntity | null>; material: StandardMaterial; darkMaterial: StandardMaterial }) {
  return <Entity name="m0-procedural-fallback-character" ref={playerRef} position={[0, 0, 1.15]}><Entity name="fallback-torso" position={[0, 1.05, 0]} scale={[0.62, 0.85, 0.36]}><Render type="box" material={material} /></Entity><Entity name="fallback-helmet" position={[0, 1.85, 0]} scale={[0.34, 0.34, 0.34]}><Render type="sphere" material={darkMaterial} /></Entity><Entity name="fallback-pack" position={[0, 1.15, 0.38]} scale={[0.38, 0.58, 0.18]}><Render type="box" material={darkMaterial} /></Entity><Entity name="fallback-left-leg" position={[-0.2, 0.38, 0]} scale={[0.18, 0.62, 0.2]}><Render type="capsule" material={darkMaterial} /></Entity><Entity name="fallback-right-leg" position={[0.2, 0.38, 0]} scale={[0.18, 0.62, 0.2]}><Render type="capsule" material={darkMaterial} /></Entity></Entity>;
}

const INCIDENT_FLAME_VERTEX = `
precision highp float;
attribute vec3 aPosition;
attribute vec2 aUv0;
uniform mat4 matrix_model;
uniform mat4 matrix_viewProjection;
varying vec2 vUv;
void main(void) {
  vUv = aUv0;
  gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);
}
`;

const INCIDENT_FLAME_FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uPhase;
uniform float uOpacity;
uniform float uHeat;
uniform float uKind;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

void main(void) {
  vec2 uv = vUv;
  float time = uTime * (uKind > 0.5 ? 0.28 : 0.82) + uPhase;
  vec2 p = uv * 2.0 - 1.0;
  float y = clamp(uv.y, 0.0, 1.0);
  float broad = smoothstep(0.0, 0.12, y) * (1.0 - smoothstep(0.72, 1.0, y));
  float lean = (y * y) * (fbm(vec2(time * 0.31, y * 1.7 + uPhase)) - 0.5) * 0.55;
  float center = lean + sin(time * 0.57 + y * 4.3) * 0.08 * y;
  float width = mix(0.56, 0.16, y) + broad * 0.12;
  float leftNoise = fbm(vec2(p.y * 2.2 + time * 0.42 + 4.0, time * 0.18 + 2.0)) - 0.5;
  float rightNoise = fbm(vec2(p.y * 2.0 - time * 0.37 + 8.0, time * 0.22 + 5.0)) - 0.5;
  float edge = mix(leftNoise, rightNoise, step(0.0, p.x)) * (0.12 + 0.15 * y);
  float bodyDistance = abs(p.x - center) / max(0.05, width + edge);
  float body = 1.0 - smoothstep(0.72, 1.0, bodyDistance);
  float topBreak = fbm(vec2(p.x * 2.8 + time * 0.46, time * 0.32 + y * 4.0));
  float taper = smoothstep(0.01, 0.09, y) * (1.0 - smoothstep(0.82 + topBreak * 0.12, 1.02, y));
  float tongues = max(max(smoothstep(0.55, 0.9, topBreak + sin(p.x * 8.0 + time) * 0.15), smoothstep(0.56, 0.92, fbm(vec2(p.x * 5.0 - time * 0.5, y * 3.0 + 3.0)))), smoothstep(0.64, 0.94, fbm(vec2(p.x * 8.0 + time * 0.7, y * 5.0 + 11.0))));
  float alpha = body * taper * (0.78 + tongues * 0.22);
  float core = (1.0 - smoothstep(0.0, 0.58, abs(p.x - center) / max(0.04, width * 0.48))) * smoothstep(0.0, 0.18, y) * (1.0 - smoothstep(0.45, 0.8, y));
  float detail = fbm(vec2(p * 3.2 + vec2(time * 0.7, -time * 0.9)));
  alpha *= 0.82 + detail * 0.18;
  if (uKind > 0.5) {
    float smoke = body * smoothstep(0.35, 0.98, y) * (0.55 + detail * 0.45);
    vec3 smokeColor = mix(vec3(0.16, 0.18, 0.19), vec3(0.32, 0.34, 0.34), detail);
    float smokeAlpha = smoke * uOpacity * 0.22;
    if (smokeAlpha < 0.012) discard;
    gl_FragColor = vec4(smokeColor, smokeAlpha);
    return;
  }
  if (alpha < 0.025) discard;
  vec3 outer = vec3(0.96, 0.22, 0.025);
  vec3 middle = vec3(1.0, 0.58, 0.08);
  vec3 hot = vec3(1.0, 0.92, 0.42);
  vec3 color = mix(outer, middle, smoothstep(0.18, 0.68, core + detail * 0.16));
  color = mix(color, hot, core * (0.72 + uHeat * 0.24));
  float emission = (0.72 + uHeat * 0.35) * (0.72 + core * 0.45);
  gl_FragColor = vec4(color * emission, alpha * uOpacity);
}
`;

function createIncidentFlameMaterial(app: ReturnType<typeof useApp>, name: string, phase: number, contained: boolean, smoke = false) {
  const material = new ShaderMaterial({ uniqueName: "m0-incident-effect-v1", vertexGLSL: INCIDENT_FLAME_VERTEX, fragmentGLSL: INCIDENT_FLAME_FRAGMENT, attributes: { aPosition: SEMANTIC_POSITION, aUv0: SEMANTIC_TEXCOORD0 } });
  material.name = name;
  material.blendType = BLEND_NORMAL;
  material.cull = CULLFACE_NONE;
  material.depthTest = true;
  material.depthWrite = false;
  material.setParameter("uTime", performance.now() / 1000);
  material.setParameter("uPhase", phase);
  material.setParameter("uKind", smoke ? 1 : 0);
  material.setParameter("uOpacity", smoke ? (contained ? 0.04 : 0.09) : (contained ? 0.5 : 0.78));
  material.setParameter("uHeat", contained ? 0.35 : 0.95);
  void app;
  return material;
}

function IncidentVisual({ contained, compact = false }: { contained: boolean; compact?: boolean }) {
  const app = useApp();
  const groupRef = useRef<PcEntity | null>(null);
  const materials = useMemo(() => [0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4].map((phase, index) => createIncidentFlameMaterial(app, `m0-incident-flame-slice-${index}`, phase, contained)), [app, contained]);
  const smokeMaterial = useMemo(() => createIncidentFlameMaterial(app, "m0-incident-smoke-wisp", 2.4, contained, true), [app, contained]);
  const fireScale = compact ? 0.84 : 0.98;
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.debug("[PlayCanvas M0] incident VFX", { entity: "m0-fictional-incident-visual/incident-flame-outer", mesh: "logical anchor only; visible geometry is transparent crossed flame planes", slices: 4, smoke: "transparent procedural wisp", dimensions: compact ? "response compact: approx 0.39m x 0.44m" : "incident contained: approx 0.45m x 0.51m", anchor: "middle station surface, camera-facing side", purpose: "small representational fictional flame" });
  }, [compact]);
  useEffect(() => {
    const update = () => {
      const time = performance.now() / 1000;
      materials.forEach((material, index) => {
        material.setParameter("uTime", time);
        material.setParameter("uPhase", index * 0.73 + (index % 2 ? 0.18 : 0));
      });
      smokeMaterial.setParameter("uTime", time);
    };
    app.on("update", update);
    return () => { app.off("update", update); materials.forEach((material) => material.destroy()); smokeMaterial.destroy(); };
  }, [app, materials, smokeMaterial]);
  return <Entity name="m0-fictional-incident-visual" ref={groupRef} position={[0, 1.28, -6.9]}><Entity name="incident-flame-outer"><Entity name="incident-flame-slice-0" position={[-0.045, 0.17, 0]} rotation={[90, 0, 0]} scale={[0.46 * fireScale, 1, 0.52 * fireScale]}><Render castShadows={false} receiveShadows={false} type="plane" material={materials[0]} /></Entity><Entity name="incident-flame-slice-45" position={[0.02, 0.18, 0]} rotation={[90, 45, 0]} scale={[0.44 * fireScale, 1, 0.55 * fireScale]}><Render castShadows={false} receiveShadows={false} type="plane" material={materials[1]} /></Entity><Entity name="incident-flame-slice-90" position={[0.045, 0.16, 0.01]} rotation={[90, 90, 0]} scale={[0.42 * fireScale, 1, 0.5 * fireScale]}><Render castShadows={false} receiveShadows={false} type="plane" material={materials[2]} /></Entity><Entity name="incident-flame-slice-135" position={[-0.01, 0.19, -0.01]} rotation={[90, 135, 0]} scale={[0.4 * fireScale, 1, 0.58 * fireScale]}><Render castShadows={false} receiveShadows={false} type="plane" material={materials[3]} /></Entity></Entity><Entity name="incident-smoke-wisp" position={[0.01, 0.46, 0]} rotation={[90, 0, 0]} scale={[0.3 * fireScale, 1, 0.38 * fireScale]}><Render castShadows={false} receiveShadows={false} type="plane" material={smokeMaterial} /></Entity></Entity>;
}

function Controller({ playerRef, cameraRef, initialPosition, initialYaw, onInteract, onMovementState }: { playerRef: MutableRefObject<PcEntity | null>; cameraRef: MutableRefObject<PcEntity | null>; initialPosition: { x: number; z: number }; initialYaw: number; onInteract: (position: { x: number; z: number }) => void; onMovementState: (state: keyof typeof CLIPS) => void }) {
  const app = useApp();
  const state = useRef({ x: initialPosition.x, z: initialPosition.z, yaw: initialYaw, pitch: 8, lastMovement: "IDLE" as keyof typeof CLIPS, keys: new Set<string>() });
  useEffect(() => {
    const canvas = app.graphicsDevice.canvas;
    const paused = { value: false };
    const onPause = (event: Event) => { paused.value = Boolean((event as CustomEvent<boolean>).detail); if (paused.value) state.current.keys.clear(); };
    const down = (event: KeyboardEvent) => { if (paused.value) return; state.current.keys.add(event.key.toLowerCase()); if (["w", "a", "s", "d", "shift"].includes(event.key.toLowerCase())) event.preventDefault(); if (event.key.toLowerCase() === "e") onInteract({ x: state.current.x, z: state.current.z }); };
    const up = (event: KeyboardEvent) => state.current.keys.delete(event.key.toLowerCase());
    const move = (event: PointerEvent) => { if (document.pointerLockElement !== canvas) return; state.current.yaw -= event.movementX * 0.08; state.current.pitch = Math.max(2, Math.min(24, state.current.pitch - event.movementY * 0.05)); };
    const lock = () => canvas.requestPointerLock?.();
    const update = (dt: number) => { if (paused.value) return; const s = state.current; const forward = Number(s.keys.has("w")) - Number(s.keys.has("s")); const strafe = Number(s.keys.has("d")) - Number(s.keys.has("a")); const speed = s.keys.has("shift") ? 3.6 : 2.25; const movement = forward || strafe ? (s.keys.has("shift") ? "RUN" : "WALK") : "IDLE"; if (movement !== s.lastMovement) { s.lastMovement = movement; onMovementState(movement); } const angle = s.yaw * Math.PI / 180; const moveX = Math.cos(angle) * strafe - Math.sin(angle) * forward; const moveZ = -Math.cos(angle) * forward - Math.sin(angle) * strafe; s.x = Math.max(-3.25, Math.min(3.25, s.x + moveX * speed * dt)); s.z = Math.max(-19.2, Math.min(3.1, s.z + moveZ * speed * dt)); const player = playerRef.current; const camera = cameraRef.current; if (!player || !camera) return; player.setPosition(s.x, 0, s.z); if (forward || strafe) player.setEulerAngles(0, Math.atan2(moveX, moveZ) * 180 / Math.PI, 0); const distance = s.keys.has("shift") ? 3.1 : 2.8; const target = { x: s.x, y: 1.18, z: s.z - 0.42 }; camera.setPosition(s.x + 0.58, 1.72 + Math.sin(s.pitch * Math.PI / 180) * 0.42, s.z + distance); camera.lookAt(target.x, target.y, target.z); };
    app.on("update", update); window.addEventListener("mission-pause", onPause); window.addEventListener("keydown", down); window.addEventListener("keyup", up); window.addEventListener("pointermove", move); canvas.addEventListener("click", lock);
    return () => { app.off("update", update); window.removeEventListener("mission-pause", onPause); window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("pointermove", move); canvas.removeEventListener("click", lock); };
  }, [app, cameraRef, initialPosition.x, initialPosition.z, initialYaw, onInteract, onMovementState, playerRef]);
  return null;
}

function WorldProjection({ cameraRef, displays }: { cameraRef: MutableRefObject<PcEntity | null>; displays: Array<{ getElement: () => HTMLDivElement | null; position: readonly [number, number, number] }> }) {
  const app = useApp();
  useEffect(() => { const canvas = app.graphicsDevice.canvas; const update = () => { const camera = cameraRef.current?.camera; if (!camera) return; displays.forEach(({ getElement, position }) => { const element = getElement(); if (!element) return; const point = camera.worldToScreen(new Vec3(position[0], position[1], position[2])); const visible = point.z > 0 && point.x > -80 && point.x < canvas.clientWidth + 80 && point.y > -80 && point.y < canvas.clientHeight + 80; element.style.display = visible ? "grid" : "none"; if (visible) { element.style.left = `${point.x}px`; element.style.top = `${point.y}px`; } }); }; app.on("update", update); update(); return () => { app.off("update", update); }; }, [app, cameraRef, displays]);
  return null;
}

function M0Scene({ session, reviewStage, cameraRef, onInteract }: { session: MissionSessionState; reviewStage?: ReviewStage; cameraRef: MutableRefObject<PcEntity | null>; onInteract: (station: M0Station) => void }) {
  const playerRef = useRef<PcEntity | null>(null); const [characterState, setCharacterState] = useState<keyof typeof CLIPS>("IDLE"); const [characterReady, setCharacterReady] = useState(false);
  const suitMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.74, 0.78, 0.76); material.update(); return material; }, []); const darkMaterial = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.07, 0.1, 0.11); material.update(); return material; }, []);
  const accent = useMemo(() => { const material = new StandardMaterial(); material.diffuse = new Color(0.82, 0.18, 0.05); material.emissive = new Color(0.42, 0.03, 0.01); material.emissiveIntensity = 1.2; material.update(); return material; }, []);
  const stage = session.phase === "INSERTION" ? "CORRIDOR" : session.phase === "INCIDENT" ? "INCIDENT" : session.phase === "RESPONSE" ? "RESPONSE" : "ARCHIVE";
  const reviewLayout = m0ReviewLayout(reviewStage);
  const initialPosition = useMemo(() => reviewStage === "incident" ? { x: -0.85, z: -5.05 } : reviewLayout.spawn, [reviewLayout, reviewStage]);
  const interactAtPosition = useCallback((position: { x: number; z: number }) => {
    const targets: Record<string, Array<{ id: M0Station; x: number; z: number }>> = { CORRIDOR: [{ id: "incident", x: 0, z: -5.2 }], INCIDENT: [{ id: "heater", x: -2.3, z: -7.2 }, { id: "garment", x: 0, z: -7.2 }, { id: "vent", x: 2.3, z: -7.2 }], RESPONSE: [{ id: "vent-cut", x: -2.3, z: -9.3 }, { id: "vent-increase", x: 0, z: -9.3 }, { id: "suppression", x: 2.3, z: -9.3 }], ARCHIVE: [{ id: "archive", x: 0, z: -14.8 }] };
    const target = targets[stage].find((item) => Math.hypot(position.x - item.x, position.z - item.z) < 2.05); if (target) onInteract(target.id);
  }, [onInteract, stage]);
  const incidentContained = session.phase === "ARCHIVE";
  return <>
    <Entity name="m0-camera" ref={cameraRef} position={[0.58, 1.72, 3.95]}><Camera fov={64} nearClip={0.05} farClip={80} clearColor="#091116" /></Entity>
    <Entity name="m0-key-light" rotation={[35, -25, 0]}><Light type="directional" intensity={1.4} color="#e7edf2" castShadows shadowBias={0.25} normalOffsetBias={0.08} shadowDistance={28} /></Entity><Entity name="m0-fill-light" position={[0, 3, -7]}><Light type="omni" intensity={1.25} range={16} color="#a7c9d4" /></Entity><Entity name="m0-incident-light" position={[0, 1.8, -6.9]}><Light type="omni" intensity={incidentContained ? 0.35 : 1.55} range={4.5} color="#ff9d4d" /></Entity><Entity name="m0-archive-light" position={[0, 2, -14.8]}><Light type="omni" intensity={1.2} range={5} color="#bfe7ed" /></Entity>
    {(!reviewStage || reviewStage === "corridor") && <><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, 0]} /><AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, -4.15]} /></>}{(!reviewStage || reviewStage === "incident" || reviewStage === "response") && <AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, -8.35]} />}{(!reviewStage || reviewStage === "archive") && <><AssetModule file="gravifire_corridor_4m.glb" position={[0, 0, -12.5]} /><AssetModule file="gravifire_lab_shell_8x8.glb" position={[0, 0, -16.7]} /></>}
    {(!reviewStage || reviewStage === "corridor") && <><AssetModule file="gravifire_bulkhead_door.glb" position={[0, 0, -3.72]} /><AssetModule file="gravifire_equipment_rack.glb" position={[-2.8, 0, -1.5]} rotation={[0, Math.PI / 2, 0]} /><AssetModule file="gravifire_equipment_rack.glb" position={[2.8, 0, -1.5]} rotation={[0, -Math.PI / 2, 0]} /></>}
    {(!reviewStage || reviewStage === "incident" || reviewStage === "response") && <><AssetModule file="gravifire_science_console.glb" position={[-2.3, 0, -7.2]} onClick={() => onInteract("heater")} /><AssetModule file="gravifire_science_console.glb" position={[0, 0, -7.2]} onClick={() => onInteract("garment")} /><AssetModule file="gravifire_science_console.glb" position={[2.3, 0, -7.2]} onClick={() => onInteract("vent")} /><AssetModule file="gravifire_equipment_rack.glb" position={[-2.9, 0, -6.4]} rotation={[0, Math.PI / 2, 0]} /><IncidentVisual contained={incidentContained} compact={stage === "RESPONSE"} /><Entity name="m0-incident-alarm" position={[0, 2.45, -5.2]} scale={[0.15, 0.15, 0.15]}><Render type="box" material={accent} /></Entity></>}
    {(!reviewStage || reviewStage === "response") && <><AssetModule file="gravifire_science_console.glb" position={[-2.3, 0, -9.3]} onClick={() => onInteract("vent-cut")} /><AssetModule file="gravifire_science_console.glb" position={[0, 0, -9.3]} onClick={() => onInteract("vent-increase")} /><AssetModule file="gravifire_science_console.glb" position={[2.3, 0, -9.3]} onClick={() => onInteract("suppression")} /><AssetModule file="gravifire_bulkhead_door.glb" position={[0, 0, -11.75]} /> </>}
    {(!reviewStage || reviewStage === "archive") && <AssetModule file="gravifire_analysis_wall.glb" position={[0, 0, -14.8]} scale={0.82} onClick={() => onInteract("archive")} />}
    <M0InteriorDetails />
    <Character playerRef={playerRef} clip={CLIPS[characterState]} onReady={setCharacterReady} />{!characterReady && <FallbackCharacter playerRef={playerRef} material={suitMaterial} darkMaterial={darkMaterial} />}<Controller playerRef={playerRef} cameraRef={cameraRef} initialPosition={initialPosition} initialYaw={reviewLayout.yaw} onInteract={interactAtPosition} onMovementState={setCharacterState} />
  </>;
}

function ProjectedM0Displays({ stage, setDisplayRef }: { stage: string; setDisplayRef: (id: string) => (element: HTMLDivElement | null) => void }) {
  if (stage === "INCIDENT") return <><div ref={setDisplayRef("incident")} className="playcanvas-projected-header"><span>FICTIONAL INCIDENT</span><strong>DECK-B ALERT</strong><small>REPRESENTATIONAL SCENE · NOT A NASA REPLAY</small></div><div ref={setDisplayRef("limit")} className="playcanvas-projected-limit">GARMENT · NO MATCHING MICROGRAVITY EVIDENCE IN CURRENT ARCHIVE</div></>;
  if (stage === "RESPONSE") return <div ref={setDisplayRef("response")} className="playcanvas-projected-header"><span>INCIDENT RESPONSE</span><strong>OPERATIONAL ACTION REQUIRED</strong><small>NO ACTION IS SCIENTIFICALLY GUARANTEED</small></div>;
  if (stage === "ARCHIVE") return <div ref={setDisplayRef("archive")} className="playcanvas-projected-header"><span>ARCHIVE HANDOFF</span><strong>EVIDENCE LIMIT REVIEW</strong><small>FICTIONAL INCIDENT · ARCHIVE-DOMAIN BOUNDARY</small></div>;
  return null;
}

export default function PlayCanvasM0Pilot({ reviewStage }: { reviewStage?: ReviewStage }) {
  const router = useRouter();
  const { session, patchSession, markStationReviewed } = useMissionSession("m0-playcanvas");
  const [campaign, setCampaign] = useState<CampaignState>(() => createInitialCampaign(campaignMissions)); const [progress, setProgress] = useState(() => beginM0(createInitialCampaign(campaignMissions).missions.m0)); const [message, setMessage] = useState("EMBER · Operations channel online.");
  const cameraRef = useRef<PcEntity | null>(null); const incidentRef = useRef<HTMLDivElement | null>(null); const limitRef = useRef<HTMLDivElement | null>(null); const responseRef = useRef<HTMLDivElement | null>(null); const archiveRef = useRef<HTMLDivElement | null>(null);
  const [inspected, setInspected] = useState<string[]>([]); const [showEvidence, setShowEvidence] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { const saved = parseCampaignState(window.localStorage.getItem(CAMPAIGN_STORAGE_KEY), campaignMissions); const started = beginM0(saved.missions.m0); const reviewBeat: MissionBeat = reviewStage === "corridor" ? "INSERTION" : reviewStage === "incident" || reviewStage === "response" ? "INCIDENT_RESPONSE" : "EVIDENCE_REVEAL"; const reviewProgress = reviewStage ? { ...started, currentBeat: reviewBeat } : started; setCampaign({ ...saved, activeMissionId: "m0", missions: { ...saved.missions, m0: reviewProgress } }); setProgress(reviewProgress); if (!reviewStage) window.localStorage.setItem(CAMPAIGN_STORAGE_KEY, serializeCampaignState({ ...saved, activeMissionId: "m0", missions: { ...saved.missions, m0: started } })); if (reviewStage === "incident") { setInspected(["heater", "garment", "vent"]); patchSession({ phase: "INCIDENT", activeObjective: "INSPECT INCIDENT SYSTEMS", reviewedStations: ["heater", "garment", "vent"] }); } else if (reviewStage === "response") { setInspected(["heater", "garment", "vent"]); patchSession({ phase: "RESPONSE", activeObjective: "CHOOSE OPERATIONAL RESPONSE", reviewedStations: ["heater", "garment", "vent"] }); } else if (reviewStage === "archive") { setInspected(["heater", "garment", "vent"]); setShowEvidence(true); patchSession({ phase: "ARCHIVE", activeObjective: "REVIEW EVIDENCE LIMIT" }); } }, 0); return () => window.clearTimeout(timer); }, [patchSession, reviewStage]);
  const persist = useCallback((nextProgress: typeof progress, nextState: CampaignState = campaign) => { const saved = { ...nextState, activeMissionId: "m0", missions: { ...nextState.missions, m0: nextProgress } }; setCampaign(saved); setProgress(nextProgress); if (!reviewStage) window.localStorage.setItem(CAMPAIGN_STORAGE_KEY, serializeCampaignState(saved)); }, [campaign, reviewStage]);
  const handleInteract = useCallback((station: M0Station) => {
    const phase = session.phase;
    if (station === "incident" && phase === "INSERTION") { patchSession({ phase: "INCIDENT", activeObjective: "INSPECT HEATER, GARMENT, AND VENTILATION" }); setProgress((current) => current); setMessage("EMBER · Incident contained locally. Inspect the three system conditions."); return; }
    if (["heater", "garment", "vent"].includes(station) && phase === "INCIDENT") { const next = Array.from(new Set([...inspected, station])); setInspected(next); markStationReviewed(station); if (next.length === 3) { patchSession({ phase: "RESPONSE", activeObjective: "CHOOSE AN OPERATIONAL RESPONSE" }); setMessage("EMBER · Relevant conditions inspected. No garment match is present in the current archive."); } else setMessage(`EMBER · ${next.length} / 3 incident systems inspected.`); return; }
    if (["vent-cut", "vent-increase", "suppression"].includes(station) && phase === "RESPONSE") { const decision = station as "vent-cut" | "vent-increase" | "suppression"; const nextProgress = setM0Decision(progress, decision); const nextState = addDecision(campaign, { missionId: "m0", decisionId: "incident-response", selectedOption: decision, evidenceAlignment: "NOT_APPLICABLE", evidenceRefs: [], selectedAt: new Date().toISOString() }); persist(nextProgress, nextState); patchSession({ phase: "ARCHIVE", activeObjective: "REVIEW EVIDENCE LIMIT", activePanel: decision }); setShowEvidence(true); setMessage("EMBER · Action recorded. Review what GRAVIFIRE can and cannot establish."); return; }
    if (station === "archive" && phase === "ARCHIVE") { setShowEvidence(true); setMessage("EMBER · This fictional incident is not a NASA replay. The archive boundary is explicit."); }
  }, [campaign, inspected, markStationReviewed, patchSession, persist, progress, session.phase]);
  const complete = useCallback(() => { const gap = { id: "m0-garment-gap", missionId: "m0", title: "MICROGRAVITY FIRE RESPONSE OF THIS GARMENT / CONFIGURATION", missingCondition: "MICROGRAVITY FIRE RESPONSE OF THIS GARMENT / CONFIGURATION", reason: "No matching run-level evidence is linked to this fictional incident.", nearestEvidenceRefs: [], loggedAt: "2038-01-01T00:00:00.000Z" }; const withGap = addGap(campaign, gap); const withManual = unlockManual(withGap, { id: "FM-01", title: "EVIDENCE BEFORE INTUITION", text: m0Mission.fieldManualEntry?.text ?? "", missionId: "m0", evidenceRefs: [], unlocked: true }); const finished = completeMission(withManual, "m0", "m1"); if (!reviewStage) window.localStorage.setItem(CAMPAIGN_STORAGE_KEY, serializeCampaignState(finished)); router.push("/mission-control"); }, [campaign, reviewStage, router]);
  const stage = session.phase === "INSERTION" ? "CORRIDOR" : session.phase === "INCIDENT" ? "INCIDENT" : session.phase === "RESPONSE" ? "RESPONSE" : "ARCHIVE";
  const objective = stage === "CORRIDOR" ? "RESPOND TO DECK-B ALERT" : stage === "INCIDENT" ? `INSPECT INCIDENT SYSTEMS · ${inspected.length} / 3` : stage === "RESPONSE" ? "CHOOSE OPERATIONAL RESPONSE" : "REVIEW EVIDENCE LIMIT";
  const location = stage === "CORRIDOR" ? "CREW CORRIDOR · DECK B" : stage === "INCIDENT" ? "INCIDENT BAY · FICTIONAL SCENE" : stage === "RESPONSE" ? "INCIDENT BAY · RESPONSE CONSOLE" : "ARCHIVE TERMINAL · EVIDENCE HANDOFF";
  const layoutStage: M0PlayCanvasStage = stage === "INCIDENT" ? "incident" : stage === "RESPONSE" ? "response" : "archive";
  const anchor = stage === "CORRIDOR" ? M0_REVIEW_LAYOUT.corridor.anchor : M0_REVIEW_LAYOUT[layoutStage].anchor;
  const setDisplayRef = useCallback((id: string) => (element: HTMLDivElement | null) => { if (id === "incident") incidentRef.current = element; else if (id === "limit") limitRef.current = element; else if (id === "response") responseRef.current = element; else if (id === "archive") archiveRef.current = element; }, []);
  const getStageElement = useCallback(() => (stage === "INCIDENT" ? incidentRef : stage === "RESPONSE" ? responseRef : archiveRef).current, [stage]);
  const getLimitElement = useCallback(() => limitRef.current, []);
  return <div className="playcanvas-pilot"><Application fillMode={FILLMODE_FILL_WINDOW} resolutionMode={RESOLUTION_AUTO} graphicsDeviceOptions={{ antialias: true, alpha: false }}><M0Scene session={session} reviewStage={reviewStage} cameraRef={cameraRef} onInteract={handleInteract} /><WorldProjection cameraRef={cameraRef} displays={[{ getElement: getStageElement, position: anchor }, ...(stage === "INCIDENT" ? [{ getElement: getLimitElement, position: [0, 1.4, -7.2] as const }] : [])]} /></Application><div className="playcanvas-hud" aria-label="M0 PlayCanvas HUD"><div className="playcanvas-objective"><span>M0 · {m0Mission.title}</span><strong>{objective}</strong><small>{location}</small></div><div className="playcanvas-crosshair">·</div><div className="playcanvas-ember">{message}</div><ProjectedM0Displays stage={stage} setDisplayRef={setDisplayRef} />{showEvidence && <div className="playcanvas-projected-evidence"><span>EVIDENCE BOUNDARY · FICTIONAL INCIDENT</span><strong>NO MATCHING MICROGRAVITY EVIDENCE IN CURRENT ARCHIVE</strong><small>This is not a NASA replay. GRAVIFIRE can support an operational decision without claiming a direct garment result.</small><button onClick={complete}>COMPLETE M0 · UNLOCK FM-01</button></div>}</div></div>;
}
