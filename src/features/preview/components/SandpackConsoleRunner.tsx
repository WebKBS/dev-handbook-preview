import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";
import { useState } from "react";
import { ensureReactEntry, ensureVanillaEntry } from "../entry";
import { loadFiles } from "../loader";
import { inferTemplate } from "../template";

const SandpackConsoleRunner = ({
  domain,
  slug,
  exampleId,
}: {
  domain: string;
  slug: string;
  exampleId: string;
}) => {
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

  // 미리보기 높이도 같이 토글
  const previewHeight = isAuto ? 720 : 360;

  // 래퍼 폭 측정

  return (
    <SandpackProvider
      template={template}
      files={files}
      theme={githubLight}
      options={{
        activeFile,
        visibleFiles,
      }}
    >
      <SandpackLayout>
        <SandpackCodeEditor
          showTabs
          showLineNumbers
          style={{
            height: isAuto ? "auto" : 300,
          }}
        />

        <button
          type="button"
          className="w-full py-2 bg-blue-100 text-sm font-bold"
          onClick={() => setIsAuto((v) => !v)}
        >
          {isAuto ? "간략히 보기" : "자세히 보기"}
        </button>

        <SandpackPreview
          style={{
            height: previewHeight,
          }}
        />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export default SandpackConsoleRunner;
