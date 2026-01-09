import { RAW } from "./fileStore";

type SandpackFile =
  | string
  | { code: string; hidden?: boolean; active?: boolean; readOnly?: boolean };

function baseDir(domain: string, slug: string, exampleId: string) {
  // fileStore.ts glob 경로와 동일한 prefix로 맞춰야 함
  return `../../previews/${domain}/${slug}/${exampleId}`;
}

export function loadFiles(domain: string, slug: string, exampleId: string) {
  const base = baseDir(domain, slug, exampleId);
  const files: Record<string, SandpackFile> = {};

  for (const [absPath, code] of Object.entries(RAW)) {
    if (!absPath.startsWith(base + "/")) continue;

    // "../../previews/.../components/Counter.jsx" -> "/components/Counter.jsx"
    const rel = absPath.slice(base.length);
    const sandpackPath = rel.startsWith("/") ? rel : `/${rel}`;

    files[sandpackPath] = code;
  }

  return files;
}
