import { readFileSync } from "node:fs";
import { defineConfig } from "tsdown";

// Single source of truth for the version: package.json.
// Injected as __PLUGIN_VERSION__ so index.ts / sandbox-entry.ts never drift.
const { version } = JSON.parse(readFileSync("./package.json", "utf8")) as {
  version: string;
};

export default defineConfig({
  entry: {
    index: "index.ts",
    "sandbox-entry": "sandbox-entry.ts",
    admin: "admin.tsx",
  },
  format: "esm",
  dts: true,
  deps: {
    // React must come from the host admin app. Bundling a second copy makes
    // every hook in admin.tsx throw "Invalid hook call".
    neverBundle: ["emdash", /^react($|\/)/, /^react-dom($|\/)/],
  },
  define: {
    __PLUGIN_VERSION__: JSON.stringify(version),
  },
});
