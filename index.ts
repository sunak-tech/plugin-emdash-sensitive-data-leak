import type { PluginDescriptor } from "emdash";

export function sensitiveDataLeakPlugin(): PluginDescriptor {
  return {
    id: "sensitive-data-leak-detector",
    version: __PLUGIN_VERSION__,
    format: "native",
    entrypoint: "@snack222/plugin-emdash-sensitive-data-leak/sandbox",
    adminEntry: "@snack222/plugin-emdash-sensitive-data-leak/admin",
    adminPages: [
      { path: "/warnings", label: "機密情報警告" }
    ],
    adminWidgets: [
      { id: "warnings", title: "機密情報検出", size: "full" }
    ],
    capabilities: ["read:content", "write:content"],
    options: {},
  };
}