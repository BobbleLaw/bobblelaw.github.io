import { existsSync, rmSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

type Presentation = {
  name: string;
  directory: string;
  route: string;
  enabled?: boolean;
  includeNotes?: boolean;
};

type Manifest = {
  presentations: Presentation[];
};

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(repositoryRoot, "content", "slides", "presentations.json");
const installOnly = process.argv.includes("--install");
const frozenLockfile = process.argv.includes("--frozen-lockfile");

function fail(message: string): never {
  throw new Error(`[presentations] ${message}`);
}

function run(command: string[], cwd: string): void {
  const result = Bun.spawnSync(command, {
    cwd,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  if (result.exitCode !== 0) {
    fail(`Command failed in ${cwd}: ${command.join(" ")}`);
  }
}

function validateRelativePath(value: string, label: string): void {
  if (!value || isAbsolute(value) || value.split(/[\\/]/).includes("..")) {
    fail(`${label} must be a non-empty path within the repository: ${value}`);
  }
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Manifest;

if (!Array.isArray(manifest.presentations)) {
  fail("content/slides/presentations.json must contain a presentations array");
}

const enabled = manifest.presentations.filter((presentation) => presentation.enabled !== false);
const routes = new Set<string>();

for (const presentation of enabled) {
  validateRelativePath(presentation.directory, "directory");

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(presentation.route)) {
    fail(`route must be a lowercase URL slug: ${presentation.route}`);
  }
  if (routes.has(presentation.route)) {
    fail(`duplicate route: ${presentation.route}`);
  }
  routes.add(presentation.route);

  const sourceDirectory = resolve(repositoryRoot, presentation.directory);
  if (!sourceDirectory.startsWith(repositoryRoot + sep)) {
    fail(`directory resolves outside the repository: ${presentation.directory}`);
  }
  for (const requiredFile of ["package.json", "slides.md"]) {
    if (!existsSync(join(sourceDirectory, requiredFile))) {
      fail(`${presentation.name} is missing ${requiredFile}`);
    }
  }

  if (installOnly) {
    const installCommand = [process.execPath, "install"];
    if (frozenLockfile) installCommand.push("--frozen-lockfile");
    console.log(`[presentations] Installing: ${presentation.name}`);
    run(installCommand, sourceDirectory);
    continue;
  }

  const outputDirectory = join(repositoryRoot, "public", "slides", presentation.route);
  const basePath = `/slides/${presentation.route}/`;
  const slidevBinary = join(sourceDirectory, "node_modules", ".bin", "slidev");

  if (!existsSync(slidevBinary)) {
    fail(`${presentation.name} dependencies are not installed; run this script with --install first`);
  }

  // The target is derived from a validated slug under Hugo's generated output.
  // Remove only this deck's previous build so stale hashed assets cannot accumulate.
  rmSync(outputDirectory, { recursive: true, force: true });

  const buildCommand = [
    slidevBinary,
    "build",
    "slides.md",
    "--base",
    basePath,
    "--out",
    outputDirectory,
  ];
  if (!presentation.includeNotes) buildCommand.push("--without-notes");

  console.log(`[presentations] Building: ${presentation.name} -> ${basePath}`);
  run(buildCommand, sourceDirectory);
}

console.log(`[presentations] ${installOnly ? "Installed" : "Built"} ${enabled.length} presentation(s)`);
