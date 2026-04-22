import { definePlugin } from "emdash";
import type { ContentHookEvent, PluginContext } from "emdash";

const patterns = [
  { name: "APIキー (OpenAI)", regex: /sk-[a-zA-Z0-9]{32,}/g },
  { name: "GitHub Token", regex: /ghp_[a-zA-Z0-9]{36}/g },
  { name: "JWT Token", regex: /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g },
  { name: "メールアドレス", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/g },
];

type WarningLog = {
  at: string;
  collection: string;
  detected: string;
};
export function createPlugin() {
  return definePlugin({
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