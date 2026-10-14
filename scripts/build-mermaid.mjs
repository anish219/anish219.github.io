import { mkdir } from "node:fs/promises";
import { build } from "esbuild";

await mkdir("scripts/generated", { recursive: true });
await build({
  entryPoints: ["scripts/mermaid-client.js"],
  outfile: "scripts/generated/mermaid.js",
  bundle: true,
  minify: true,
  platform: "browser",
  format: "esm",
  target: ["safari17.4", "chrome121", "firefox123"],
});
