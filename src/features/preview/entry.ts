type SandpackFile =
  | string
  | { code: string; hidden?: boolean; active?: boolean; readOnly?: boolean };

function setActive(files: Record<string, SandpackFile>, path: string) {
  const v = files[path];
  if (!v) return;
  files[path] =
    typeof v === "string" ? { code: v, active: true } : { ...v, active: true };
}

function prependToFile(
  files: Record<string, SandpackFile>,
  path: string,
  prefix: string,
) {
  if (!prefix) return;

  const file = files[path];
  if (!file) return;

  const code = typeof file === "string" ? file : file.code ?? "";
  const next = `${prefix}\n${code}`;

  files[path] = typeof file === "string" ? next : { ...file, code: next };
}

function appendToFile(
  files: Record<string, SandpackFile>,
  path: string,
  suffix: string,
) {
  if (!suffix) return;

  const file = files[path];
  if (!file) return;

  const code = typeof file === "string" ? file : file.code ?? "";
  const next = `${code}\n${suffix}`;

  files[path] = typeof file === "string" ? next : { ...file, code: next };
}

function buildCssImports(
  files: Record<string, SandpackFile>,
  target: "root" | "src",
) {
  const prefix = target === "root" ? "." : "..";

  return Object.keys(files)
    .filter((path) => path.endsWith(".css"))
    .map((path) => {
      const normalized = path.startsWith("/") ? `${prefix}${path}` : path;
      return `import "${normalized}";`;
    })
    .join("\n");
}

function extractInlineScripts(files: Record<string, SandpackFile>) {
  const html = files["/index.html"];
  if (!html) return "";

  const code = typeof html === "string" ? html : html.code ?? "";
  const matches = [
    ...code.matchAll(
      /<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];

  return matches
    .map((m) => m[1].trim())
    .filter(Boolean)
    .join("\n\n");
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
  // 우선순위: /index.js -> /main.js -> /src/index.js
  const hasMain = !!files["/main.js"];
  const hasIndex = !!files["/index.js"];
  const hasSrcIndex = !!files["/src/index.js"];
  const cssImportsRoot = buildCssImports(files, "root");
  const inlineScripts = extractInlineScripts(files);

  // /index.js가 있으면 거기에 CSS import를 붙이고 그대로 엔트리로 사용
  if (hasIndex) {
    prependToFile(files, "/index.js", cssImportsRoot);
    appendToFile(files, "/index.js", inlineScripts);
    setActive(files, "/index.js");
    return;
  }

  // /main.js만 있으면 숨겨진 엔트리(/index.js)에서 CSS + main.js를 로드
  if (hasMain) {
    files["/index.js"] = {
      hidden: true,
      code: [cssImportsRoot, `import "./main.js";`, inlineScripts]
        .filter(Boolean)
        .join("\n\n"),
    };
    setActive(files, "/main.js");
    return;
  }

  // /src/index.js만 있으면 숨겨진 /index.js에서 CSS + src/index.js를 로드
  if (hasSrcIndex) {
    files["/index.js"] = {
      hidden: true,
      code: [cssImportsRoot, `import "./src/index.js";`, inlineScripts]
        .filter(Boolean)
        .join("\n\n"),
    };
    setActive(files, "/src/index.js");
    return;
  }

  // Sandpack vanilla 템플릿 기본 index.js가 DOM을 건드려 HTML-only 예제가 깨지는 문제 방지
  const hasAnyEntry = !!(
    hasMain || hasIndex || hasSrcIndex || files["/src/index.js"]
  );
  if (!hasAnyEntry) {
    files["/index.js"] = {
      hidden: true,
      code: [cssImportsRoot, inlineScripts].filter(Boolean).join("\n\n"),
    };
  }
}
