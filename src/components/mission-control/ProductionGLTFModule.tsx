"use client";

import { Clone, useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

/**
 * Visual-only GLB module loader. Collision remains in MissionScene/Rapier;
 * this component never creates physics bodies or interaction state.
 */
export default function ProductionGLTFModule({ src, position = [0, 0, 0], scale = 1 }: { src: string; position?: [number, number, number]; scale?: number }) {
  const asset = useGLTF(src);
  useEffect(() => {
    asset.scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (material?.map) material.map.colorSpace = THREE.SRGBColorSpace;
      if (material?.emissiveMap) material.emissiveMap.colorSpace = THREE.SRGBColorSpace;
    });
  }, [asset.scene]);
  return <Clone object={asset.scene} position={position} scale={scale} />;
}
