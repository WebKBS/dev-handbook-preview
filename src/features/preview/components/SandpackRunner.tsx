import { Sandpack } from "@codesandbox/sandpack-react";
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

  return (
    <>
      <button type={"button"} onClick={() => setIsAuto(!isAuto)}>
        {isAuto ? "자세히 보기" : "간략히 보기"}
      </button>
      <Sandpack
        template={template}
        files={files}
        options={{
          showTabs: true,
          showLineNumbers: true,
          visibleFiles,
          activeFile,
          editorHeight: isAuto ? "auto" : 300,
        }}
        theme={githubLight}
      />
    </>
  );
};

export default SandpackRunner;
