import { definePlugin } from "emdash";
import type { ContentHookEvent, PluginContext } from "emdash";

const patterns = [
  { name: "APIキー (OpenAI)", regex: /sk-[a-zA-Z0-9]{32,}/g },
  { name: "GitHub Token", regex: /ghp_[a-zA-Z0-9]{36}/g },
  { name: "JWT Token", regex: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g },
];

type WarningLog = {
  at: string;
  collection: string;
  entry: string;
  detected: string;
};

/**
 * content:beforeSave receives only the entry's field data - the id and slug
 * live outside it and are not available here. The title is the only thing an
 * editor can actually use to find the entry again.
 */
function entryLabel(event: ContentHookEvent): string {
  for (const key of ["title", "slug", "name"]) {
    const value = event.content[key];
    if (typeof value === "string" && value.trim() !== "") return value;
  }
  return event.isNew ? "(new entry)" : "(untitled)";
}
export function createPlugin() {
  return definePlugin({
    id: "sensitive-data-leak-detector",
    version: __PLUGIN_VERSION__,
    capabilities: ["read:content", "write:content"],
    hooks: {
      "content:beforeSave": async (event: ContentHookEvent, ctx: PluginContext) => {
        const text = JSON.stringify(event.content);

        const found = patterns.filter((p) => {
          p.regex.lastIndex = 0;
          return p.regex.test(text);
        });

        if (found.length > 0) {
          const names = found.map((p) => p.name).join(", ");
          const raw = await ctx.kv.get("warnings");
          const logs = (raw as WarningLog[]) ?? [];
          logs.unshift({
            at: new Date().toISOString(),
            collection: event.collection,
            entry: entryLabel(event),
            detected: names,
          });
          await ctx.kv.set("warnings", logs.slice(0, 50));
        }
      },
    },

    routes: {
      warnings: {
        handler: async (ctx: PluginContext) => {
          const raw = await ctx.kv.get("warnings");
          return (raw as WarningLog[]) ?? [];
        },
      },
    },
  });
}