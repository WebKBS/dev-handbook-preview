// src/features/preview/components/SandpackRunner.tsx
import { Sandpack } from "@codesandbox/sandpack-react";
import { ensureReactEntry } from "../entry";
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

  console.log("template:", template);
  console.log("Loaded files:", Object.keys(files));

  const visibleFiles = Object.keys(files).filter((p) => p !== "/App.js"); // 브리지는 숨김

  return (
    <Sandpack
      template={template as any}
      files={files as any}
      options={{
        showTabs: true,
        showLineNumbers: true,
        visibleFiles,
        activeFile: visibleFiles[0],
      }}
    />
  );
};

export default SandpackRunner;
