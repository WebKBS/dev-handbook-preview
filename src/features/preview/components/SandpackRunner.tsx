import { Sandpack } from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";
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
    <Sandpack
      template={template}
      files={files}
      options={{
        showTabs: true,
        showLineNumbers: true,
        visibleFiles,
        activeFile,
      }}
      theme={githubLight}
    />
  );
};

export default SandpackRunner;
