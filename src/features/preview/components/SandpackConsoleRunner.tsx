import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";
import { useMemo, useState } from "react";
import CustomSandpackConsole from "./CustomSandpackConsole";
import { ensureReactEntry, ensureVanillaEntry } from "../entry";
import { loadFiles } from "../loader";
import { inferTemplate } from "../template";

export default function SandpackConsoleRunner({
  domain,
  slug,
  exampleId,
}: {
  domain: string;
  slug: string;
  exampleId: string;
}) {
  const [isAuto, setIsAuto] = useState(false);

  const template = inferTemplate(domain);
  const files = loadFiles(domain, slug, exampleId);

  if (template === "react") ensureReactEntry(files);
  if (template === "vanilla") ensureVanillaEntry(files);

  const visibleFiles = Object.entries(files)
    .filter(([path, file]) => {
      if (path === "/App.js") return false;
      if (typeof file === "string") return true;
      return !file.hidden;
    })
    .map(([path]) => path);

  const activeFile = visibleFiles[0] ?? Object.keys(files)[0];

  // ✅ .html 파일 존재 여부로 Preview 표시 결정
  const hasHtml = useMemo(
    () => Object.keys(files).some((p) => p.toLowerCase().endsWith(".html")),
    [files],
  );

  return (
    <SandpackProvider
      template={template}
      files={files}
      theme={githubLight}
      options={{
        activeFile,
        visibleFiles,
        autoReload: false,
      }}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showTabs
          showLineNumbers
          style={{ height: isAuto ? "auto" : 300 }}
        />

        <button
          type="button"
          className="w-full py-2 bg-blue-100 text-sm font-bold"
          onClick={() => setIsAuto((v) => !v)}
        >
          {isAuto ? "간략히 보기" : "자세히 보기"}
        </button>

        {hasHtml ? (
          <>
            <SandpackPreview
              style={{
                width: "100%",
                height: "100%",
              }}
            />
            <CustomSandpackConsole height={300} />
          </>
        ) : (
          <>
            {/* 런타임 로그 수집용: Preview는 "숨겨서" 마운트 유지 */}
            <div
              aria-hidden
              style={{ display: "none", width: "100%", height: "100%" }}
            >
              <SandpackPreview />
            </div>

            <CustomSandpackConsole height={300} />
          </>
        )}
      </SandpackLayout>
    </SandpackProvider>
  );
}
