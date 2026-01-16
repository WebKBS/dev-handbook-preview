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

const SandpackRunner = ({
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
      if (path === "/App.js") return false; // react 브리지는 숨김
      if (typeof file === "string") return true;
      return !file.hidden;
    })
    .map(([path]) => path);

  const activeFile = visibleFiles[0] ?? Object.keys(files)[0];

  // 미리보기 높이도 같이 토글
  const previewHeight = isAuto ? 720 : 360;

  return (
    <>
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
              // 에디터 높이 토글
              height: isAuto ? "auto" : 300,
              // auto일 때 스크롤/레이아웃이 어색하면 아래처럼도 가능
              // maxHeight: isAuto ? 800 : 300,
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
              // ✅ 이게 미리보기 height 제어
              height: previewHeight,
            }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </>
  );
};

export default SandpackRunner;
