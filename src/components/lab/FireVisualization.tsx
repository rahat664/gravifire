"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { FIRE_VISUAL_PROFILES, type FireVisualProfile } from "@/lib/fire-visual-profiles";
import type { FireVisualState } from "@/lib/fire-visual-mapping";

type FireReview = "close" | "side";

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uFlow;
uniform float uBuoyancy;
uniform float uTurbulence;
uniform float uPhase;
uniform float uMotion;
void main(){
  vUv=uv;
  vec3 p=position;
  float h=uv.y;
  float motion=uMotion;
  float slow=sin(h*3.4+uTime*.72*motion+uPhase)*.10;
  float mid=sin(h*10.0-uTime*1.55*motion+uPhase*1.7)*.045;
  float fast=sin(h*24.0+uTime*3.7*motion+uPhase*2.2)*.018;
  p.x+=(slow+mid+fast)*h*uTurbulence+uFlow*h*h;
  p.z+=sin(h*8.0-uTime*1.12+uPhase)*.045*h*uTurbulence;
  p.y+=sin(h*6.0+uTime*.9+uPhase)*.025*h*uTurbulence;
  p.x*=1.0-h*.38*uBuoyancy;
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
}`;

const fragmentShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uHeat;
uniform float uSeed;
uniform float uPhase;
uniform float uCore;
uniform float uMotion;
uniform float uOpacity;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
}
float fbm(vec2 p){
  float v=0.; float a=.5;
  v+=noise(p)*a; p=p*2.03+vec2(7.1,3.4); a*=.5;
  v+=noise(p)*a; p=p*2.17+vec2(2.6,8.7); a*=.5;
  v+=noise(p)*a; p=p*2.31+vec2(5.8,1.9); a*=.5;
  v+=noise(p)*a;
  return v/.9375;
}
float tongue(vec2 p, vec2 c, float r){return exp(-dot((p-c)/vec2(r,r*1.5),(p-c)/vec2(r,r*1.5))*3.2);}

void main(){
  vec2 p=vUv;
  float t=uTime;
  float motion=uMotion;
  float low=fbm(p*vec2(1.55,2.2)+vec2(t*.28*motion+uSeed,-t*.18*motion+uPhase));
  float mid=fbm(p*vec2(4.5,6.0)+vec2(-t*.72*motion+uPhase,t*.52*motion+uSeed));
  float high=fbm(p*vec2(11.0,15.0)+vec2(t*1.9*motion-uSeed,-t*1.55*motion+uPhase));
  float center=.5+(low-.5)*.22+(mid-.5)*.12+sin(t*.7+uSeed)*.035;
  float y=p.y;
  float taper=mix(.43,.065,smoothstep(.03,1.02,y));
  float lean=(low-.5)*.24+(mid-.5)*.10;
  float left=center-taper-(fbm(vec2(p.y*3.1+t*.35,uSeed+2.0))*-.11+.02);
  float right=center+taper+(fbm(vec2(p.y*3.7-t*.42,uSeed+6.0))*.11-.02);
  float edge=smoothstep(left-.12,left+.025,p.x)*(1.0-smoothstep(right-.025,right+.12,p.x));
  float base=smoothstep(.015,.13,y);
  float upper=smoothstep(1.08,.16,y);
  float tongues=
    tongue(p,vec2(.29+lean,.83+sin(t*.63+uSeed)*.035),.12)+
    tongue(p,vec2(.50+lean,.98+sin(t*.71+uSeed*1.3)*.04),.105)+
    tongue(p,vec2(.70+lean,.79+sin(t*.89+uSeed*1.8)*.04),.13)+
    tongue(p,vec2(.43+lean,1.08+sin(t*.54+uSeed*2.2)*.03),.075);
  float erosion=smoothstep(.16,.68,low*.62+mid*.28+high*.1);
  float envelope=edge;
  float body=envelope*(base*upper*smoothstep(.27,.62,erosion+.24)+tongues*.22*upper);
  float coreShape=tongue(p,vec2(center+.02,.19),.29)*base*smoothstep(.48,.08,y)*(.76+mid*.32)*envelope;
  float alpha=clamp(max(body,coreShape*uCore)*(.58+high*.28)*uOpacity,0.,.82);
  if(alpha<.018) discard;
  float hot=clamp(coreShape*.95+smoothstep(.42,.82,1.-y)*.18+mid*.18,0.,1.);
  vec3 outer=vec3(.72,.055,.008);
  vec3 orange=vec3(1.0,.22,.012);
  vec3 gold=vec3(1.0,.67,.045);
  vec3 core=vec3(1.0,.96,.69);
  vec3 color=mix(outer,orange,smoothstep(.05,.42,hot));
  color=mix(color,gold,smoothstep(.35,.74,hot));
  color=mix(color,core,smoothstep(.72,1.,hot)*uCore);
  gl_FragColor=vec4(color*(.86+uHeat*.18),alpha);
}`;

type FlameLayerProps = { scale: [number, number, number]; seed: number; phase: number; profile: FireVisualProfile; heat: number; state: FireVisualState; core?: boolean };

function FlameLayer({ scale, seed, phase, profile, heat, state, core = false }: FlameLayerProps) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const config = FIRE_VISUAL_PROFILES[profile];
  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uFlow.value = THREE.MathUtils.damp(material.current.uniforms.uFlow.value, state.flowVector[0] * 1.8, 5, 1 / 60);
    material.current.uniforms.uBuoyancy.value = THREE.MathUtils.damp(material.current.uniforms.uBuoyancy.value, state.buoyancyVisual, 5, 1 / 60);
    material.current.uniforms.uTurbulence.value = THREE.MathUtils.damp(material.current.uniforms.uTurbulence.value, state.turbulence, 5, 1 / 60);
    material.current.uniforms.uMotion.value = THREE.MathUtils.damp(material.current.uniforms.uMotion.value, state.flickerSpeed, 5, 1 / 60);
    material.current.uniforms.uOpacity.value = THREE.MathUtils.damp(material.current.uniforms.uOpacity.value, state.opacity, 5, 1 / 60);
    material.current.uniforms.uHeat.value = THREE.MathUtils.damp(material.current.uniforms.uHeat.value, heat * state.intensity, 5, 1 / 60);
    material.current.uniforms.uCore.value = THREE.MathUtils.damp(material.current.uniforms.uCore.value, (core ? 1 : .72) * state.coreIntensity, 5, 1 / 60);
  });
  return <mesh scale={scale} rotation={[0, seed * .8, seed * .12]} renderOrder={2}>
    <planeGeometry args={[1, 1, 20, 28]} />
    <shaderMaterial ref={material} transparent depthWrite={false} side={THREE.DoubleSide} blending={THREE.NormalBlending}
      uniforms={{ uTime: { value: 0 }, uFlow: { value: config.flow[0] }, uBuoyancy: { value: config.buoyancy }, uTurbulence: { value: config.turbulence }, uHeat: { value: heat }, uSeed: { value: seed }, uPhase: { value: phase }, uCore: { value: core ? 1 : .72 }, uMotion: { value: 1 }, uOpacity: { value: 1 } }}
      vertexShader={vertexShader} fragmentShader={fragmentShader} />
  </mesh>;
}

function FireLight({ profile, state }: { profile: FireVisualProfile; state: FireVisualState }) {
  const light = useRef<THREE.PointLight>(null);
  const base = profile === "MICROGRAVITY_REPRESENTATIONAL" ? .72 : profile === "LOW_G_REPRESENTATIONAL" ? .86 : 1.05;
  useFrame(({ clock }) => {
    if (!light.current) return;
    const t = clock.elapsedTime;
    const smoothNoise = .5 + .28 * Math.sin(t * 1.3 + .6) + .14 * Math.sin(t * 3.7 + 1.7) + .08 * Math.sin(t * 8.1);
    const target = base * .72 * state.glowStrength * (.88 + smoothNoise * .16);
    light.current.intensity = THREE.MathUtils.damp(light.current.intensity, target, 5, 1 / 60);
  });
  return <pointLight ref={light} color="#ff8b32" intensity={base * .82} distance={2.8} decay={2.2} position={[0, .5, .12]} />;
}

function Smoke({ profile, state }: { profile: FireVisualProfile; state: FireVisualState }) {
  const group = useRef<THREE.Group>(null);
  const puffs = useMemo(() => Array.from({ length: 6 }, (_, index) => ({ x: Math.sin(index * 2.3) * .08, y: .52 + index * .07, z: Math.cos(index * 1.7) * .04, size: .055 + (index % 3) * .018 })), []);
  useFrame(({ clock }) => { if (group.current) group.current.position.x = Math.sin(clock.elapsedTime * .55) * .06; });
  if (!FIRE_VISUAL_PROFILES[profile].smoke || state.smokeAmount <= 0) return null;
  return <group ref={group}>{puffs.map((puff, index) => <mesh key={index} position={[puff.x * .72, .78 + index * .085, puff.z * .72]} scale={puff.size * .72}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#8b9290" transparent opacity={.026 * state.smokeAmount} depthWrite={false} /></mesh>)}</group>;
}

function FireScene({ profile, state }: { profile: FireVisualProfile; state: FireVisualState }) {
  const config = FIRE_VISUAL_PROFILES[profile];
  const fireBody = useRef<THREE.Group>(null);
  const wisps = useMemo(() => Array.from({ length: 10 }, (_, index) => ({ scale: [.12 + (index % 3) * .025, .34 + (index % 4) * .06, 1] as [number, number, number], x: Math.sin(index * 2.7) * .2, z: Math.cos(index * 1.9) * .12, seed: index * .71 + .4 })), []);
  useFrame((_, delta) => {
    if (fireBody.current) {
      const scale = THREE.MathUtils.damp(fireBody.current.scale.x, state.scale, 5, delta);
      fireBody.current.scale.setScalar(scale);
    }
  });
  return <>
    <color attach="background" args={["#08101a"]} />
    <ambientLight intensity={.48} color="#b7d6e5" />
    <directionalLight position={[2, 4, 3]} intensity={1.3} color="#d8e6ed" />
    <group position={[0, .12, 0]}>
      <mesh position={[0, .08, 0]}><cylinderGeometry args={[.22, .25, .1, 32]} /><meshStandardMaterial color="#252c32" roughness={.74} metalness={.35} /></mesh>
      <mesh position={[0, .21, 0]}><cylinderGeometry args={[.045, .06, .14, 16]} /><meshStandardMaterial color="#9b8064" roughness={.88} metalness={.12} /></mesh>
      <mesh position={[0, .3, .04]} rotation={[0, 0, -.08]}><planeGeometry args={[.26, .065]} /><meshStandardMaterial color="#8f795f" roughness={.95} side={THREE.DoubleSide} /></mesh>
      <group ref={fireBody} position={[0, .39, 0]}>
        <FlameLayer scale={[.94, 1.70 * config.elongation, 1]} seed={.3} phase={.2} profile={profile} heat={.82} state={state} />
        <FlameLayer scale={[.76, 1.40 * config.elongation, 1]} seed={1.9} phase={1.7} profile={profile} heat={.88} state={state} />
        <FlameLayer scale={[.59, 1.16 * config.elongation, 1]} seed={3.7} phase={3.1} profile={profile} heat={.94} state={state} />
        <FlameLayer scale={[.45, .94 * config.elongation, 1]} seed={5.2} phase={4.6} profile={profile} heat={1} state={state} core />
        {wisps.map((wisp, index) => <group key={index} position={[wisp.x, .03 + (index % 3) * .06, wisp.z]} rotation={[0, index * .73, 0]}><FlameLayer scale={wisp.scale} seed={wisp.seed} phase={index * 1.13} profile={profile} heat={.76} state={state} /></group>)}
        <Smoke profile={profile} state={state} />
        <FireLight profile={profile} state={state} />
      </group>
    </group>
  </>;
}

function FireCamera() {
  const { camera } = useThree();
  useFrame(() => camera.lookAt(new THREE.Vector3(0, .7, 0)));
  return null;
}

export default function FireVisualization({ profile, review, visualState }: { profile: FireVisualProfile; review?: FireReview; visualState: FireVisualState }) {
  const camera: [number, number, number] = review === "side" ? [-2.3, 1.35, 1.3] : review === "close" ? [.82, 1.2, 2.5] : [.95, 1.25, 4.2];
  return <div className="h-full min-h-0 w-full" role="img" aria-label="Representational fire visualization"><Canvas className="!block h-full w-full" camera={{ position: camera, fov: review ? 32 : 32 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}><FireCamera /><FireScene profile={profile} state={visualState} /></Canvas></div>;
}
