import { RAW } from "./fileStore";

export type PreviewIndex = Record<
  string, // domain
  Record<
    string, // slug
    string[] // exampleIds
  >
>;

function parseParts(path: string) {
  // path 예: "../../previews/react/use-state/counter/components/Counter.jsx"
  const idx = path.indexOf("/previews/");
  if (idx < 0) return null;

  const rest = path.slice(idx + "/previews/".length); // "react/use-state/counter/..."
  const parts = rest.split("/");

  const [domain, slug, exampleId] = parts;
  if (!domain || !slug || !exampleId) return null;

  return { domain, slug, exampleId };
}

export function buildPreviewIndex(): PreviewIndex {
  const index: PreviewIndex = {};

  for (const p of Object.keys(RAW)) {
    const parsed = parseParts(p);
    if (!parsed) continue;

    const { domain, slug, exampleId } = parsed;

    index[domain] ??= {};
    index[domain][slug] ??= new Set<string>() as any;

    // Set으로 중복 제거
    (index[domain][slug] as any).add(exampleId);
  }

  // Set -> Array 변환 + 정렬
  for (const domain of Object.keys(index)) {
    for (const slug of Object.keys(index[domain])) {
      const set = index[domain][slug] as any as Set<string>;
      index[domain][slug] = Array.from(set).sort();
    }
  }

  return index;
}
