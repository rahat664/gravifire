"use client";

import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { expSmoothing, parseCameraMode, parseShoulder, smoothAngle, SHOULDER_STORAGE_KEY, thirdPersonCameraConfig, toggleCameraMode, toggleShoulder, CAMERA_MODE_STORAGE_KEY, type CameraMode, type Shoulder } from "@/lib/camera-state";

export type PlayerRigState = React.MutableRefObject<{
  physicsPosition: THREE.Vector3;
  visualPosition: THREE.Vector3;
  velocity: THREE.Vector3;
  initialized: boolean;
  moving: boolean;
  sprinting: boolean;
  crouched: boolean;
}>;

function Analyzer({ visible, raised }: { visible: boolean; raised: boolean }) {
  return <group visible={visible} position={[0.34, 1.18, -0.16]} rotation={[raised ? -0.2 : 0.05, 0, raised ? -0.12 : -0.25]}>
    <mesh castShadow><boxGeometry args={[0.14, 0.28, 0.08]} /><meshStandardMaterial color="#172b3b" metalness={0.7} roughness={0.3} /></mesh>
    <mesh position={[0, 0.04, -0.055]}><boxGeometry args={[0.09, 0.09, 0.012]} /><meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={1.6} /></mesh>
    <mesh position={[0, -0.18, 0]}><cylinderGeometry args={[0.045, 0.06, 0.2, 8]} /><meshStandardMaterial color="#263746" metalness={0.65} roughness={0.35} /></mesh>
    <mesh position={[0, 0.08, -0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.08, 10]} /><meshStandardMaterial color="#9aa8ad" metalness={0.85} roughness={0.22} /></mesh>
  </group>;
}

/** Temporary reviewed fallback until the mission-engineer GLB is added. */
function ProceduralEngineerFallback({ rigState, scannerRaised }: { rigState: PlayerRigState; scannerRaised: boolean }) {
  const leftArm = useRef<THREE.Mesh>(null); const rightArm = useRef<THREE.Mesh>(null); const leftLeg = useRef<THREE.Mesh>(null); const rightLeg = useRef<THREE.Mesh>(null); const cycle = useRef(0);
  const root = useRef<THREE.Group>(null);
  useFrame((_, delta) => { const { moving, sprinting, crouched } = rigState.current; const stride = moving ? (sprinting ? 0.34 : 0.2) : 0; cycle.current += delta * (sprinting ? 8 : 6); const swing = Math.sin(cycle.current) * stride; if (leftArm.current) leftArm.current.rotation.x = swing; if (rightArm.current) rightArm.current.rotation.x = -swing; if (leftLeg.current) leftLeg.current.rotation.x = swing; if (rightLeg.current) rightLeg.current.rotation.x = -swing; if (root.current) root.current.scale.y = crouched ? 0.76 : 1; });
  return <group ref={root}>
    <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.52, 0.72, 1]}><circleGeometry args={[0.42, 20]} /><meshBasicMaterial color="#02070b" transparent opacity={0.28} depthWrite={false} /></mesh>
    <group position={[0, 1.72, 0]}><mesh castShadow><sphereGeometry args={[0.22, 16, 10]} /><meshStandardMaterial color="#d9e0e1" roughness={0.68} /></mesh><mesh position={[0, 0, -0.17]}><sphereGeometry args={[0.17, 16, 10]} /><meshStandardMaterial color="#14252d" metalness={0.45} roughness={0.28} /></mesh></group>
    <mesh position={[0, 1.04, 0]} castShadow><boxGeometry args={[0.58, 0.82, 0.34]} /><meshStandardMaterial color="#d0d7d8" roughness={0.78} /></mesh>
    <mesh position={[0, 1.06, -0.19]}><boxGeometry args={[0.28, 0.1, 0.025]} /><meshStandardMaterial color="#55d7e8" emissive="#55d7e8" emissiveIntensity={1.5} /></mesh>
    <mesh position={[0, 0.72, 0.2]}><boxGeometry args={[0.5, 0.3, 0.18]} /><meshStandardMaterial color="#17272d" metalness={0.55} roughness={0.45} /></mesh>
    <mesh ref={leftArm} position={[-0.38, 1.08, 0]} castShadow><capsuleGeometry args={[0.075, 0.5, 5, 8]} /><meshStandardMaterial color="#26343a" roughness={0.76} /></mesh>
    <mesh ref={rightArm} position={[0.38, 1.08, 0]} castShadow><capsuleGeometry args={[0.075, 0.5, 5, 8]} /><meshStandardMaterial color="#26343a" roughness={0.76} /></mesh>
    <mesh ref={leftLeg} position={[-0.18, 0.38, 0]} castShadow><capsuleGeometry args={[0.105, 0.58, 5, 8]} /><meshStandardMaterial color="#d9e0e1" roughness={0.78} /></mesh>
    <mesh ref={rightLeg} position={[0.18, 0.38, 0]} castShadow><capsuleGeometry args={[0.105, 0.58, 5, 8]} /><meshStandardMaterial color="#d9e0e1" roughness={0.78} /></mesh>
    <mesh position={[-0.18, -0.02, -0.08]}><boxGeometry args={[0.18, 0.12, 0.35]} /><meshStandardMaterial color="#111a20" roughness={0.8} /></mesh>
    <mesh position={[0.18, -0.02, -0.08]}><boxGeometry args={[0.18, 0.12, 0.35]} /><meshStandardMaterial color="#111a20" roughness={0.8} /></mesh>
    <Analyzer visible raised={scannerRaised} />
  </group>;
}

export default function ThirdPersonRig({ rig }: { rig: PlayerRigState }) {
  const getState = useThree((state) => state.get);
  const rigState = useRef(rig.current);
  const [, getKeys] = useKeyboardControls();
  const avatar = useRef<THREE.Group>(null);
  const ray = useRef(new THREE.Raycaster());
  const [mode, setMode] = useState<CameraMode>("THIRD_PERSON");
  const [shoulder, setShoulder] = useState<Shoulder>("RIGHT");
  const [focus, setFocus] = useState(false);
  const phase = useRef(0);
  const facing = useRef(0);
  const cameraDistance = useRef(thirdPersonCameraConfig.distance);

  useEffect(() => {
    const modeTimer = window.setTimeout(() => { setMode(parseCameraMode(localStorage.getItem(CAMERA_MODE_STORAGE_KEY))); setShoulder(parseShoulder(localStorage.getItem(SHOULDER_STORAGE_KEY))); }, 0);
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key.toLowerCase() === "v") { const next = toggleCameraMode(parseCameraMode(localStorage.getItem(CAMERA_MODE_STORAGE_KEY))); localStorage.setItem(CAMERA_MODE_STORAGE_KEY, next); setMode(next); window.dispatchEvent(new CustomEvent("camera-mode-changed", { detail: next })); }
      if (event.key.toLowerCase() === "q") { const next = toggleShoulder(parseShoulder(localStorage.getItem(SHOULDER_STORAGE_KEY))); localStorage.setItem(SHOULDER_STORAGE_KEY, next); setShoulder(next); }
    };
    const onMode = (event: Event) => setMode((event as CustomEvent<CameraMode>).detail);
    const onFocus = (event: Event) => setFocus(Boolean((event as CustomEvent<boolean>).detail));
    window.addEventListener("keydown", onKey); window.addEventListener("camera-mode-changed", onMode); window.addEventListener("focus-mode-changed", onFocus);
    return () => { window.clearTimeout(modeTimer); window.removeEventListener("keydown", onKey); window.removeEventListener("camera-mode-changed", onMode); window.removeEventListener("focus-mode-changed", onFocus); };
  }, []);

  useFrame((_, delta) => {
    if (!rigState.current.initialized) return;
    const state = getState(); const camera = state.camera as THREE.PerspectiveCamera; const { scene } = state;
    const keys = getKeys() as Record<string, boolean>;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const smooth = expSmoothing(thirdPersonCameraConfig.visualSmoothing, delta);
    const floorPosition = rigState.current.physicsPosition.clone(); floorPosition.y -= 0.8;
    rigState.current.visualPosition.lerp(floorPosition, smooth);
    const speed = Math.hypot(rigState.current.velocity.x, rigState.current.velocity.z);
    if (speed > 0.05) { phase.current += delta * speed * (rigState.current.sprinting ? 8 : 6); facing.current = smoothAngle(facing.current, Math.atan2(rigState.current.velocity.x, rigState.current.velocity.z), 14, delta); }
    if (avatar.current) { avatar.current.position.copy(rigState.current.visualPosition); avatar.current.visible = mode === "THIRD_PERSON"; avatar.current.rotation.y = facing.current; }
    const cameraDirection = new THREE.Vector3(); camera.getWorldDirection(cameraDirection); cameraDirection.y = 0;
    if (cameraDirection.lengthSq() < 0.001) cameraDirection.set(0, 0, -1); else cameraDirection.normalize();
    const target = rigState.current.visualPosition.clone(); target.y += thirdPersonCameraConfig.targetHeight;
    if (mode === "FIRST_PERSON") {
      const eye = rigState.current.visualPosition.clone(); eye.y += rigState.current.crouched ? 1.1 : 1.62;
      camera.position.lerp(eye, expSmoothing(24, delta));
    } else {
      const right = new THREE.Vector3(-cameraDirection.z, 0, cameraDirection.x).multiplyScalar(shoulder === "RIGHT" ? thirdPersonCameraConfig.shoulderOffset : -thirdPersonCameraConfig.shoulderOffset);
      const desiredDistance = focus ? thirdPersonCameraConfig.focusDistance : thirdPersonCameraConfig.distance;
      const desired = target.clone().addScaledVector(cameraDirection, -desiredDistance).add(right); desired.y += focus ? 0.02 : 0.08;
      const cast = desired.clone().sub(target); const distance = cast.length(); cast.normalize(); ray.current.set(target, cast);
      const hits = ray.current.intersectObjects(scene.children, true).filter((hit) => {
        if (avatar.current?.getObjectById(hit.object.id) || hit.distance <= 0.18) return false;
        let object: THREE.Object3D | null = hit.object;
        while (object) {
          if (!object.visible || object.userData.cameraIgnore) return false;
          object = object.parent;
        }
        return true;
      });
      const collisionDistance = hits[0] ? Math.max(thirdPersonCameraConfig.minimumDistance, Math.min(distance, hits[0].distance - 0.18)) : distance;
      const rate = collisionDistance < cameraDistance.current ? thirdPersonCameraConfig.collisionInSmoothing : thirdPersonCameraConfig.collisionOutSmoothing;
      cameraDistance.current += (collisionDistance - cameraDistance.current) * expSmoothing(rate, delta);
      const finalPosition = target.clone().addScaledVector(cast, -cameraDistance.current).add(right); finalPosition.y += focus ? 0.02 : 0.08;
      camera.position.lerp(finalPosition, expSmoothing(thirdPersonCameraConfig.positionSmoothing, delta));
    }
    const targetFov = mode === "THIRD_PERSON" ? thirdPersonCameraConfig.baseFov + (rigState.current.sprinting && !reducedMotion ? thirdPersonCameraConfig.sprintFovDelta : 0) + (focus ? thirdPersonCameraConfig.focusFovDelta : 0) : 74 + (rigState.current.sprinting && !reducedMotion ? 4 : 0) + (focus ? -3 : 0);
    camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 8, delta); camera.updateProjectionMatrix();
    void keys;
  });

  return <group ref={avatar}><ProceduralEngineerFallback rigState={rigState} scannerRaised={focus} /></group>;
}
