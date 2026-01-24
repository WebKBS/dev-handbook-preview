import { useSandpackConsole } from "@codesandbox/sandpack-react";
import type { JSX } from "react";

type ConsoleVariant = "info" | "warning" | "error" | "clear";

const iconByVariant: Record<ConsoleVariant, JSX.Element> = {
  info: (
    <svg viewBox="0 0 24 24" aria-hidden width={14} height={14}>
      <path
        d="M12 2.25A9.75 9.75 0 1 0 12 21.75 9.75 9.75 0 0 0 12 2.25ZM12 7.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25Zm1.5 9h-3a.75.75 0 0 1 0-1.5h.75v-4.5h-.75a.75.75 0 0 1 0-1.5H12a.75.75 0 0 1 .75.75v5.25h.75a.75.75 0 0 1 0 1.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" aria-hidden width={14} height={14}>
      <path
        d="M12 3.5 22 20.25a1.25 1.25 0 0 1-1.07 1.88H3.07A1.25 1.25 0 0 1 2 20.25L12 3.5Zm0 5.25a1 1 0 0 0-1 1v4.25a1 1 0 1 0 2 0V9.75a1 1 0 0 0-1-1Zm0 8.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
        fill="currentColor"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" aria-hidden width={14} height={14}>
      <path
        d="M12 2.25A9.75 9.75 0 1 0 12 21.75 9.75 9.75 0 0 0 12 2.25Zm3.18 6.57a.75.75 0 1 1 1.06 1.06L13.06 13l3.18 3.18a.75.75 0 1 1-1.06 1.06L12 14.06l-3.18 3.18a.75.75 0 1 1-1.06-1.06L10.94 13 7.76 9.82a.75.75 0 1 1 1.06-1.06L12 11.94l3.18-3.18Z"
        fill="currentColor"
      />
    </svg>
  ),
  clear: (
    <svg viewBox="0 0 24 24" aria-hidden width={14} height={14}>
      <path
        d="M5 7.5h14a.75.75 0 0 0 0-1.5H5a.75.75 0 0 0 0 1.5Zm2.5 5h9a.75.75 0 0 0 0-1.5h-9a.75.75 0 0 0 0 1.5Zm-2.5 5h14a.75.75 0 0 0 0-1.5H5a.75.75 0 0 0 0 1.5Z"
        fill="currentColor"
      />
    </svg>
  ),
};

const toVariant = (method: string): ConsoleVariant => {
  switch (method) {
    case "warn":
    case "warning":
      return "warning";
    case "error":
      return "error";
    case "clear":
      return "clear";
    default:
      return "info";
  }
};

const formatValue = (value: string | Record<string, string>): string => {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export default function CustomSandpackConsole({
  height = 300,
}: {
  height?: number;
}) {
  const { logs, reset } = useSandpackConsole({ resetOnPreviewRestart: true });

  return (
    <section className="sandpack-console" style={{ height, width: "100%" }}>
      <header className="sandpack-console__header">
        <div className="sandpack-console__title">Console</div>
        <button
          type="button"
          className="sandpack-console__clear"
          onClick={() => reset()}
        >
          Clear
        </button>
      </header>
      <div className="sandpack-console__list">
        {logs.length === 0 ? (
          <div className="sandpack-console__empty">No logs yet.</div>
        ) : (
          logs.map((log) => {
            const variant = toVariant(log.method);
            if (!log.data || log.data.length === 0) return null;

            return log.data.map((item, index) => (
              <div
                key={`${log.id}-${index}`}
                className="sandpack-console__item"
                data-variant={variant}
              >
                <span className="sandpack-console__icon">
                  {iconByVariant[variant]}
                </span>
                <pre className="sandpack-console__text">
                  {variant === "clear" ? "Console cleared" : formatValue(item)}
                </pre>
              </div>
            ));
          })
        )}
      </div>
    </section>
  );
}
