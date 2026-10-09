import { execFileSync } from "node:child_process";
import { mkdir, copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
execFileSync("pnpm", ["--filter", "@workspace/api-server", "run", "build"], { cwd: root, stdio: "inherit" });
const output = path.join(root, "exports/journal-worker");
const payload = path.join(output, "payload");
await mkdir(payload, { recursive: true });
for (const name of ["worker.mjs", "package.json", "README.md"]) {
  await copyFile(path.join(root, "tools/journal-worker", name), path.join(output, name));
}
const files = {};
for (const name of await readdir(path.join(root, "artifacts/api-server/dist"))) {
  if (!/^[a-z][a-z0-9-]*\.mjs$/.test(name) || name === "index.mjs") continue;
  const source = path.join(root, "artifacts/api-server/dist", name);
  await copyFile(source, path.join(payload, name));
  files[name] = createHash("sha256").update(await readFile(source)).digest("hex");
}
await writeFile(path.join(output, "bundle-manifest.json"), JSON.stringify({
  builtAt: new Date().toISOString(),
  timezone: "Asia/Makassar",
  cron: "0,15,30,45 9 * * *",
  files,
}, null, 2));
execFileSync(process.execPath, [path.join(output, "worker.mjs"), "--offline-check"], { stdio: "inherit" });
execFileSync("python3", ["-c", `
import pathlib, sys, zipfile
source = pathlib.Path(sys.argv[1])
with zipfile.ZipFile(sys.argv[2], "w", zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(source.rglob("*")):
        if file.is_file():
            archive.write(file, file.relative_to(source).as_posix())
`, output, path.join(root, "exports/journal-worker.zip")], { stdio: "inherit" });
console.log("Prepared exports/journal-worker.zip without credentials. Independent Scheduled deployment is NOT activated by this export.");
