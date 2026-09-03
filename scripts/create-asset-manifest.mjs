import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const source = process.argv[2];
if (!source) throw new Error("Pass the legacy repository path.");
const target = "tests/fixtures/legacy-assets.json";
if (existsSync(target))
  throw new Error("Refusing to replace the migration baseline.");
const assets = {};
function walk(directory, prefix = "") {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory())
      walk(path.join(directory, entry.name), relative + "/");
    else
      assets[relative] = createHash("sha256")
        .update(readFileSync(path.join(directory, entry.name)))
        .digest("hex");
  }
}
walk(path.join(source, "public"));
mkdirSync(path.dirname(target), { recursive: true });
writeFileSync(
  target,
  JSON.stringify(
    { sourceCommit: "cfd2e30cbfaa0568bb360dfbc3675cc874ed81b3", assets },
    null,
    2,
  ) + "\n",
);
console.log(`Recorded ${Object.keys(assets).length} original asset hashes.`);
