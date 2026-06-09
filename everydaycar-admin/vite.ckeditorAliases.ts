import fs from "node:fs";
import path from "node:path";
import type { Alias } from "vite";

/** Core packages must resolve to one copy or duplicated-modules fires. */
const CORE_PACKAGES = [
  "ckeditor5-core",
  "ckeditor5-engine",
  "ckeditor5-utils",
  "ckeditor5-ui",
  "ckeditor5-watchdog",
  "ckeditor5-typing",
  "ckeditor5-enter",
  "ckeditor5-clipboard",
  "ckeditor5-widget",
  "ckeditor5-upload",
  "ckeditor5-undo",
  "ckeditor5-select-all",
];

export function getCkeditorAliases(projectRoot: string): Alias[] {
  const nestedDir = path.join(
    projectRoot,
    "node_modules/ckeditor5/node_modules/@ckeditor",
  );
  const rootDir = path.join(projectRoot, "node_modules/@ckeditor");
  const aliases: Alias[] = [];

  const pkgDir = (pkgName: string, preferNested = false): string | null => {
    const candidates = preferNested
      ? [
          path.join(nestedDir, pkgName),
          path.join(rootDir, pkgName),
        ]
      : [
          path.join(nestedDir, pkgName),
          path.join(rootDir, pkgName),
        ];
    for (const candidate of candidates) {
      if (fs.existsSync(path.join(candidate, "package.json"))) {
        return candidate;
      }
    }
    return null;
  };

  const addAlias = (pkgName: string, preferNested = false) => {
    const dir = pkgDir(pkgName, preferNested);
    if (dir) {
      aliases.push({ find: `@ckeditor/${pkgName}`, replacement: dir });
    }
  };

  for (const pkg of CORE_PACKAGES) {
    addAlias(pkg, true);
  }

  const packageNames = new Set<string>();
  for (const base of [nestedDir, rootDir]) {
    if (!fs.existsSync(base)) continue;
    for (const entry of fs.readdirSync(base)) {
      if (entry.startsWith("ckeditor5-")) {
        packageNames.add(entry);
      }
    }
  }

  for (const name of packageNames) {
    if (!CORE_PACKAGES.includes(name)) {
      addAlias(name);
    }
  }

  return aliases;
}
