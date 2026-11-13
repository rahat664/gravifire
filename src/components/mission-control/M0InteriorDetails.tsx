"use client";

import { useEffect, useMemo } from "react";
import { Entity } from "@playcanvas/react";
import { Render } from "@playcanvas/react/components";
import { Color, StandardMaterial } from "playcanvas";

/** Visual-only fittings outside the walkable center; no colliders or interaction handlers. */
export default function M0InteriorDetails() {
  const materials = useMemo(() => {
    const panel = new StandardMaterial();
    panel.diffuse = new Color(.055, .075, .09); panel.metalness = .35; panel.gloss = .22; panel.update();
    const trim = new StandardMaterial();
    trim.diffuse = new Color(.19, .24, .28); trim.metalness = .5; trim.gloss = .3; trim.update();
    const marking = new StandardMaterial();
    marking.diffuse = new Color(.38, .28, .12); marking.gloss = .08; marking.update();
    return { panel, trim, marking };
  }, []);
  useEffect(() => () => Object.values(materials).forEach(material => material.destroy()), [materials]);
  return <Entity name="m0-visual-service-fittings">
    {[-1, 1].map(side => <Entity key={side}>
      {[-1, -6, -12, -16].map(z => <Entity key={z} name="m0-service-cover" position={[side * 3.86, 1.4, z]} scale={[.035, .85, 1.3]}><Render type="box" material={materials.panel} castShadows={false} /></Entity>)}
      <Entity name="m0-deck-edge-marking" position={[side * 2.7, .015, -8]} scale={[.035, .007, 19.5]}><Render type="box" material={materials.marking} castShadows={false} /></Entity>
    </Entity>)}
    {[-1, -3, -5, -7, -9, -11, -13, -15, -17].map(z => <Entity key={z} name="m0-deck-joint" position={[0, .012, z]} scale={[6.5, .006, .025]}><Render type="box" material={materials.trim} castShadows={false} /></Entity>)}
  </Entity>;
}
