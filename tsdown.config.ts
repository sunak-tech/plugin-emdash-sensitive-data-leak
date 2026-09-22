import { defineConfig } from "tsdown";

export default {
  entry: {
    index: "index.ts",
    "sandbox-entry": "sandbox-entry.ts",
    admin: "admin.tsx",      
  },
  format: "esm",
  dts: true,
  external: ["emdash"],
};