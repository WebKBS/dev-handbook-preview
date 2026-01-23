import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";
import { useState } from "react";
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

  return (
    <SandpackProvider
      template={template}
      files={files}
      theme={githubLight}
      options={{
        activeFile,
        visibleFiles,

        // // ✅ 핵심: 수정해도 자동 실행(리로드) 안 함
        autoReload: false,

        // (선택) 타이핑마다 번들러에 바로 반영되는 느낌이 싫으면 더 느리게
        // recompileMode: "delayed",
        // recompileDelay: 3000,
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

        <SandpackConsole style={{ height: 360 }} />

        {/* 런타임은 필요하니 마운트 유지 + 화면에서는 숨김 */}
        <div aria-hidden style={{ display: "none" }}>
          <SandpackPreview />
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
}
