import { useEffect, useState } from "react";

type WarningLog = {
  at: string;
  collection: string;
  detected: string;
};

async function fetchWarnings(): Promise<WarningLog[]> {
  const response = await fetch("/_emdash/api/plugins/sensitive-data-leak-detector/warnings", {
    method: "GET",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Failed to load warnings: ${response.status}`);
  }

  const data: unknown = await response.json();
  return (data as WarningLog[]) ?? [];
}

function WarningsWidget() {
  const [logs, setLogs] = useState<WarningLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWarnings().then((data: WarningLog[]) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>読み込み中...</div>;

  if (logs.length === 0) {
    return <div>⚠️ 検出履歴なし</div>;
  }

  return (
    <div>
      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom: "12px", padding: "8px", border: "1px solid #444", borderRadius: "6px" }}>
          <div style={{ fontSize: "12px", color: "#aaa" }}>
            {new Date(log.at).toLocaleString("ja-JP")} — {log.collection}
          </div>
          <div style={{ color: "#f87171" }}>
            🔐 {log.detected}
          </div>
        </div>
      ))}
    </div>
  );
}

export const widgets = {
  warnings: WarningsWidget,
};