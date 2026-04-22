import type { PluginDescriptor } from "emdash";

export function sensitiveDataLeakPlugin(): PluginDescriptor {
  return {
    id: "sensitive-data-leak-detector",
    version: "0.1.1",
    format: "native",
    entrypoint: "@snack222/plugin-emdash-sensitive-data-leak/sandbox",
    adminEntry: "@snack222/plugin-emdash-sensitive-data-leak/admin",
    adminWidgets: [
      { id: "warnings", title: "機密情報検出", size: "full" }
    ],
    capabilities: ["read:content", "write:content"],
    options: {},
  };
}