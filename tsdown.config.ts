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
    neverBundle: ["emdash"],
  },
  define: {
    __PLUGIN_VERSION__: JSON.stringify(version),
  },
});
