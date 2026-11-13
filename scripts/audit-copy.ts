import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const runtimeRoots = ["src/app", "src/components", "src/data/missions", "src/lib"];
const forbidden = ["PDMS", "13 s", "142.7", "UNFLOWN", "NASA HAS NOT FLOWN THIS", "NASA NEVER TESTED", "safe material", "unsafe material", "NASA approved", "extinction at 70 s", "opposed extinguished at 70 s"];
const files = runtimeRoots.flatMap((relative) => fs.existsSync(path.join(root, relative)) ? walk(path.join(root, relative)) : []);
const findings: string[] = [];
for (const file of files.filter((item) => /\.(ts|tsx)$/.test(item))) {
  const text = fs.readFileSync(file, "utf8");
  for (const phrase of forbidden) if (text.toLowerCase().includes(phrase.toLowerCase())) findings.push(`${path.relative(root, file)} contains ${JSON.stringify(phrase)}`);
}
console.log(JSON.stringify({ scannedRoots: runtimeRoots, scannedFiles: files.length, findings }, null, 2));
if (findings.length) process.exitCode = 1;

function walk(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => { const file = path.join(directory, entry.name); return entry.isDirectory() ? walk(file) : [file]; });
}
