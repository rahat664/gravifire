import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const files = ["gravifire_corridor_4m.glb", "gravifire_lab_shell_8x8.glb", "gravifire_bulkhead_door.glb", "gravifire_equipment_rack.glb", "gravifire_science_console.glb", "gravifire_analysis_wall.glb"];
/** M0-only material derivative. Binary geometry, node transforms and indices remain byte-identical. */
export function buildM0SurfaceVariant(input: Buffer): Buffer {
  if (input.readUInt32LE(0) !== 0x46546c67 || input.readUInt32LE(4) !== 2) throw new Error("Expected GLB 2");
  const jsonLength = input.readUInt32LE(12);
  const json = JSON.parse(input.subarray(20, 20 + jsonLength).toString());
  for (const material of json.materials ?? []) {
    const pbr = material.pbrMetallicRoughness;
    const color = pbr?.baseColorFactor;
    if (!pbr || !color) continue;
    const brightness = (color[0] + color[1] + color[2]) / 3;
    if (brightness > .65) pbr.baseColorFactor = [.12, .17, .21, color[3] ?? 1];
    else if (color[2] > color[0] * 3 && color[1] > .3) pbr.baseColorFactor = [.025, .12, .16, color[3] ?? 1];
    pbr.roughnessFactor = Math.max(.55, pbr.roughnessFactor ?? .6);
    pbr.metallicFactor = Math.min(.5, pbr.metallicFactor ?? 0);
    if (material.emissiveFactor) material.emissiveFactor = material.emissiveFactor.map((value: number) => value * .45);
  }
  const rawJSON = Buffer.from(JSON.stringify(json));
  const jsonBytes = Buffer.concat([rawJSON, Buffer.alloc((4 - rawJSON.length % 4) % 4, 0x20)]);
  const binaryChunk = input.subarray(20 + jsonLength);
  const result = Buffer.alloc(20 + jsonBytes.length + binaryChunk.length);
  result.writeUInt32LE(0x46546c67, 0); result.writeUInt32LE(2, 4); result.writeUInt32LE(result.length, 8);
  result.writeUInt32LE(jsonBytes.length, 12); result.writeUInt32LE(0x4e4f534a, 16); jsonBytes.copy(result, 20); binaryChunk.copy(result, 20 + jsonBytes.length);
  return result;
}

if (process.argv[1]?.replaceAll("\\", "/").endsWith("/m0/prepare-assets.ts")) {
  const source = path.resolve("public/assets/game/generated/m1");
  const output = path.resolve("public/assets/game/generated/m0");
  fs.mkdirSync(output, { recursive: true });
  const sha = (buffer: Buffer) => crypto.createHash("sha256").update(buffer).digest("hex");
  const manifest = files.map(file => {
    const original = fs.readFileSync(path.join(source, file));
    const generated = buildM0SurfaceVariant(original);
    fs.writeFileSync(path.join(output, file), generated);
    return { file, source: `../m1/${file}`, sourceSha256: sha(original), outputSha256: sha(generated), sourceBytes: original.length, outputBytes: generated.length };
  });
  fs.writeFileSync(path.join(output, "manifest.json"), JSON.stringify({ version: 1, provenance: "M0 material derivatives of existing project-owned generated assets; no third-party geometry, NASA records or collision changes", operations: ["binary geometry and node transforms preserved", "restrained graphite material palette"], files: manifest }, null, 2) + "\n");
  console.log(manifest.map(({ file, sourceBytes, outputBytes }) => ({ file, sourceBytes, outputBytes })));
}
