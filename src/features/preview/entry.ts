type SandpackFile =
  | string
  | { code: string; hidden?: boolean; active?: boolean; readOnly?: boolean };

function setActive(files: Record<string, SandpackFile>, path: string) {
  const v = files[path];
  if (!v) return;
  files[path] =
    typeof v === "string" ? { code: v, active: true } : { ...v, active: true };
}

export function ensureReactEntry(files: Record<string, SandpackFile>) {
  // 우선순위: App.tsx > App.jsx > App.js
  const appTsx = files["/App.tsx"] ? "/App.tsx" : null;
  const appJsx = files["/App.jsx"] ? "/App.jsx" : null;
  const appJs = files["/App.js"] ? "/App.js" : null;

  const entry = appTsx ?? appJsx ?? appJs;

  if (appJsx && !files["/App.js"]) {
    files["/App.js"] = {
      hidden: true,
      code: `export { default } from "./App.jsx";`,
    };
  }
  // react-ts의 경우는 그냥 /App.tsx 쓰는 편이 안정적이라 브리지는 보통 불필요

  if (entry) setActive(files, entry);
}
