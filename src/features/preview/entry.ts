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

export function ensureVanillaEntry(files: Record<string, SandpackFile>) {
  // 우선순위: /main.js -> /index.js
  const hasMain = !!files["/main.js"];
  const hasIndex = !!files["/index.js"];
  const hasSrcIndex = !!files["/src/index.js"];

  if (!hasSrcIndex) {
    if (hasMain) {
      files["/src/index.js"] = { hidden: true, code: `import "../main.js";` };
    } else if (hasIndex) {
      files["/src/index.js"] = { hidden: true, code: `import "../index.js";` };
    }
  }

  // Sandpack vanilla 템플릿 기본 index.js가 DOM을 건드려 HTML-only 예제가 깨지는 문제 방지
  const hasAnyEntry = !!(
    hasMain || hasIndex || hasSrcIndex || files["/src/index.js"]
  );
  if (!hasAnyEntry) {
    const cssImports = Object.keys(files)
      .filter((path) => path.endsWith(".css"))
      .map((path) => {
        const normalized = path.startsWith("/") ? `.${path}` : path;
        return `import "${normalized}";`;
      })
      .join("\n");

    files["/index.js"] = { hidden: true, code: cssImports };
  }
}
