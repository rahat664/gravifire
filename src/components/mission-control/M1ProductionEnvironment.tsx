"use client";

import { Clone, Text, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

const root = "/assets/game/environment/m1/";
type Interaction = { id: string; label: string; distance: number };

function Module({ file, position, rotation = [0, 0, 0] as [number, number, number], scale = 1, interaction }: { file: string; position: [number, number, number]; rotation?: [number, number, number]; scale?: number; interaction?: Interaction }) {
  const asset = useGLTF(`${root}${file}`);
  useEffect(() => {
    asset.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true; }
    });
  }, [asset.scene]);
  return <group position={position} rotation={rotation} scale={scale} userData={interaction ? { interaction, cameraIgnore: true } : undefined}><Clone object={asset.scene} /></group>;
}

function FloorGrid() {
  const tiles = Array.from({ length: 8 }, (_, index) => index - 3.5);
  return <group>{tiles.flatMap((x) => tiles.map((z) => <Module key={`${x}-${z}`} file={z === -3.5 ? "floor.glb" : x === 0 ? "floor-detail.glb" : "floor-panel.glb"} position={[x * 2.25, 0, z * 2.25]} scale={1.5} />))}</group>;
}

function LabWalls() {
  const sections = Array.from({ length: 8 }, (_, index) => index - 3.5);
  return <group>{sections.map((index) => <group key={index}><Module file={index === -1.5 || index === 2.5 ? "wall-window.glb" : "wall-detail.glb"} position={[-8.1, 1.55, index * 2.25]} rotation={[0, Math.PI / 2, 0]} scale={1.5} /><Module file={index === 0.5 ? "wall-door-wide.glb" : "wall.glb"} position={[8.1, 1.55, index * 2.25]} rotation={[0, -Math.PI / 2, 0]} scale={1.5} /></group>)}<Module file="wall-door-wide.glb" position={[0, 1.55, -8.85]} scale={1.5} /></group>;
}

function CeilingKit() {
  const bays = [-6.6, -3.3, 0, 3.3, 6.6];
  return <group>{bays.map((z) => <group key={z}><Module file="structure-panel.glb" position={[0, 3.45, z]} rotation={[0, 0, Math.PI / 2]} scale={1.2} /><Module file="rail.glb" position={[-3.8, 3.28, z]} rotation={[0, 0, Math.PI / 2]} scale={0.7} /><Module file="rail.glb" position={[3.8, 3.28, z]} rotation={[0, 0, Math.PI / 2]} scale={0.7} /></group>)}<Module file="pipe.glb" position={[-5.9, 2.85, -1.5]} rotation={[0, Math.PI / 2, 0]} scale={1.1} /><Module file="pipe.glb" position={[5.9, 2.85, -1.5]} rotation={[0, Math.PI / 2, 0]} scale={1.1} /></group>;
}

function ResearchStations() {
  return <group><Module file="table-large.glb" position={[0, 0, 4.8]} rotation={[0, Math.PI, 0]} scale={1.45} interaction={{ id: "sibal-sample", label: "INSPECT SIBAL SAMPLE", distance: 3.2 }} /><Module file="container-wide.glb" position={[-5.5, 0, 4.6]} scale={1.2} /><Module file="container-wide.glb" position={[5.5, 0, 4.2]} rotation={[0, Math.PI / 2, 0]} scale={1.2} /><Module file="computer-system.glb" position={[-3.5, 0, -1.2]} rotation={[0, 0.12, 0]} scale={1.35} interaction={{ id: "concurrent-control", label: "SET CONCURRENT FLOW", distance: 3.2 }} /><Module file="computer-system.glb" position={[3.5, 0, -1.2]} rotation={[0, -0.12, 0]} scale={1.35} interaction={{ id: "opposed-control", label: "SET OPPOSED FLOW", distance: 3.2 }} /><Module file="structure.glb" position={[0, 0, -1.3]} rotation={[0, Math.PI, 0]} scale={0.82} /><Module file="computer-wide.glb" position={[0, 0, -3.35]} rotation={[0, Math.PI, 0]} scale={1.3} interaction={{ id: "ignition-console", label: "START EVIDENCE REPLAY", distance: 3.2 }} /><Module file="table-display.glb" position={[-3.25, 0, -7.15]} rotation={[0, Math.PI, 0]} scale={1.28} /><Module file="table-display.glb" position={[3.25, 0, -7.15]} rotation={[0, Math.PI, 0]} scale={1.28} /><Module file="table-display.glb" position={[0, 0, -8.15]} rotation={[0, Math.PI, 0]} scale={1.15} interaction={{ id: "analysis-wall", label: "OPEN COMPARISON ROOM", distance: 3.2 }} /></group>;
}

function Monitor({ position, source, condition, value, accent }: { position: [number, number, number]; source: string; condition: string; value: string; accent: string }) {
  return <group position={position}><mesh><boxGeometry args={[2.35, 1.45, 0.16]} /><meshStandardMaterial color="#17232b" metalness={0.7} roughness={0.42} /></mesh><mesh position={[0, 0, -0.1]}><planeGeometry args={[2.05, 1.1]} /><meshStandardMaterial color="#071217" emissive={accent} emissiveIntensity={0.12} roughness={0.28} /></mesh><Text position={[0, 0.42, -0.12]} fontSize={0.07} color={accent} anchorX="center">{source}</Text><Text position={[0, 0.17, -0.12]} fontSize={0.052} color="#cbd8da" anchorX="center">{condition}</Text><Text position={[0, -0.17, -0.12]} fontSize={0.23} color="#f4fbfb" anchorX="center">{value}</Text><Text position={[0, -0.43, -0.12]} fontSize={0.042} color="#799096" anchorX="center">RECORDED BURN TIME · SOURCE VALUE</Text></group>;
}

function HeroMonitors() {
  return <group><Monitor position={[-3.25, 1.85, -7.2]} source="SAFFIRE-I / S1" condition="CONCURRENT · 20 cm/s" value="420 s" accent="#b8e9e7" /><Monitor position={[3.25, 1.85, -7.2]} source="SAFFIRE-I / S2" condition="OPPOSED · 20 cm/s" value="70 s" accent="#f2b36d" /><Text position={[0, 2.95, -8.12]} fontSize={0.12} color="#c4f4f7" anchorX="center" letterSpacing={0.06}>SIBAL · SOURCE COMPARISON</Text><Text position={[0, 2.72, -8.12]} fontSize={0.075} color="#93a6aa" anchorX="center" letterSpacing={0.03}>NOT A UNIVERSAL CONTROL LAW</Text></group>;
}

export default function M1ProductionEnvironment() {
  return <group><FloorGrid /><LabWalls /><CeilingKit /><ResearchStations /><HeroMonitors /><ambientLight intensity={0.72} color="#eaf3f4" /><hemisphereLight args={["#f7fbff", "#263238", 1.05]} /><pointLight position={[0, 3.25, 4.3]} color="#fff8e8" intensity={1.8} distance={10} /><pointLight position={[0, 3.25, -5.7]} color="#d8f4f4" intensity={1.4} distance={10} /></group>;
}
