import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const assetsSource = join(root, "github-pages", "assets");
const output = join(root, "dist", "public");
const assetsOutput = join(output, "assets");

execFileSync("pnpm", ["exec", "vite", "build"], {
  cwd: root,
  env: { ...process.env, GITHUB_PAGES_BASE: "./" },
  stdio: "inherit",
});

mkdirSync(assetsOutput, { recursive: true });
for (const file of readdirSync(assetsSource)) {
  cpSync(join(assetsSource, file), join(assetsOutput, file));
}

const replacements = {
  "lytex-hero-atelier_75d2a2db.jpg": "lytex-hero.jpg",
  "lytex-mark_e8fe64b5.png": "lytex-mark.png",
  "lytex-textile-detail_7439d4aa.jpg": "lytex-textile.jpg",
  "lytex-sewing-enhanced_3a8bbb1f.png": "lytex-sewing.png",
  "lytex-whatsapp-qr_a9359bfe.png": "lytex-whatsapp-qr.png",
  "lytex-dolma-enhanced_3bcce8e2.png": "lytex-dolma.png",
  "lytex-polo-enhanced_0de41434.png": "lytex-polo.png",
  "lytex-health-enhanced_0e72eced.png": "lytex-health.png",
  "lytex-brim-enhanced_068383c8.png": "lytex-brim.png",
  "page-002_44f33275.png": "page-002.png",
  "page-004_036fbd9e.png": "page-004.png",
  "page-005_ce4cc1ef.png": "page-005.png",
  "page-008_2ba28777.png": "page-008.png",
  "page-022_068b846f.png": "page-022.png",
};

function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) {
      visit(target);
      continue;
    }
    if (!entry.name.endsWith(".js") && !entry.name.endsWith(".css") && !entry.name.endsWith(".html")) continue;
    const assetPrefix = target.startsWith(assetsOutput) ? "./" : "./assets/";
    let content = readFileSync(target, "utf8").replaceAll("/manus-storage/", assetPrefix);
    for (const [from, to] of Object.entries(replacements)) content = content.replaceAll(from, to);
    writeFileSync(target, content);
  }
}

visit(output);

console.log(`GitHub Pages export ready: ${output}`);
console.log(`Local assets copied: ${readdirSync(assetsOutput).length}`);
