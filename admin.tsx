import { useEffect, useRef, useState } from "react";

type WarningLog = {
  at: string;
  collection: string;
  entry: string;
  detected: string;
  /** Written by <= 0.1.x, always "unknown". Kept so old records still render. */
  entryId?: string;
};

function entryLabel(log: WarningLog): string {
  return log.entry ?? log.entryId ?? "(unknown)";
}

async function fetchWarnings(): Promise<WarningLog[]> {
  const response = await fetch("/_emdash/api/plugins/sensitive-data-leak-detector/warnings", {
    method: "GET",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Failed to load warnings: ${response.status}`);
  }

  // emdash wraps every plugin route result in { data: ... }
  const body = (await response.json()) as { data?: WarningLog[] };
  return Array.isArray(body?.data) ? body.data : [];
}

function WarningsWidget() {
  const [logs, setLogs] = useState<WarningLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popup, setPopup] = useState<WarningLog | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const lastSeenAtRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const loadInitial = async () => {
      try {
        const data = await fetchWarnings();
        if (!mounted) return;
        setLogs(data);
        lastSeenAtRef.current = data[0]?.at ?? null;
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "警告の取得に失敗しました");
      } finally {
        if (!mounted) return;
        initializedRef.current = true;
        setLoading(false);
      }
    };

    const poll = async () => {
      try {
        const data = await fetchWarnings();
        if (!mounted) return;
        setLogs(data);

        const latest = data[0];
        if (!latest) return;

        if (initializedRef.current && latest.at !== lastSeenAtRef.current) {
          setPopup(latest);
          setPopupVisible(true);
        }

        lastSeenAtRef.current = latest.at;
        setError(null);
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "警告の取得に失敗しました");
      }
    };

    void loadInitial();
    const timer = setInterval(() => {
      void poll();
    }, 3000);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!popupVisible) return;

    const timer = setTimeout(() => {
      setPopupVisible(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [popupVisible]);

  if (loading) return <div>読み込み中...</div>;

  if (error) {
    return <div>⚠️ {error}</div>;
  }

  if (logs.length === 0) {
    return <div>⚠️ 検出履歴なし</div>;
  }

  return (
    <>
      <div>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: "12px", padding: "8px", border: "1px solid #444", borderRadius: "6px" }}>
            <div style={{ fontSize: "12px", color: "#aaa" }}>
              {new Date(log.at).toLocaleString("ja-JP")} — {log.collection} / {entryLabel(log)}
            </div>
            <div style={{ color: "#f87171" }}>
              🔐 {log.detected}
            </div>
          </div>
        ))}
      </div>

      {popup && popupVisible && (
        <div
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            width: "min(420px, calc(100vw - 32px))",
            zIndex: 9999,
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid #ef4444",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
            padding: "12px 14px",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "6px", color: "#fca5a5" }}>
            ⚠️ 機密情報の可能性を検知しました
          </div>
          <div style={{ fontSize: "13px", lineHeight: 1.5, marginBottom: "8px" }}>
            {popup.collection} / {entryLabel(popup)}
            <br />
            検知: {popup.detected}
          </div>
          <div style={{ fontSize: "12px", color: "#d1d5db" }}>
            保存は継続されています。内容を確認してください。
          </div>
        </div>
      )}
    </>
  );
}

function WarningsPage() {
  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>
        機密情報警告
      </h1>
      <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "14px" }}>
        保存時に検知された機密情報の警告履歴です。
      </p>
      <WarningsWidget />
    </div>
  );
}

export const widgets = {
  warnings: WarningsWidget,
};

export const pages = {
  "/warnings": WarningsPage,
};
