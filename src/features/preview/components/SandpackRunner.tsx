import { useElementWidth } from "@/hooks/useElementWidth.ts";
import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";
import { useMemo, useState } from "react";
import { ensureReactEntry, ensureVanillaEntry } from "../entry";
import { loadFiles } from "../loader";
import { inferTemplate } from "../template";

type PreviewMode = "default" | "desktop" | "mobile";

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

  // 3단계 모드
  const [previewMode, setPreviewMode] = useState<PreviewMode>("default");

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

  // 기존 높이 토글
  const basePreviewHeight = isAuto ? 720 : 360;

  // 시뮬레이션 기준 사이즈
  const DESKTOP_WIDTH = 1280;
  const DESKTOP_HEIGHT = 720;

  // iPhone-ish 기준(원하면 375로 바꿔도 됨)
  const MOBILE_WIDTH = 390;
  const MOBILE_HEIGHT = 844;

  // 래퍼 폭 측정
  const { ref: previewWrapRef, width: wrapWidth } =
    useElementWidth<HTMLDivElement>();

  // 모드별 목표 폭/높이
  const targetSize = useMemo(() => {
    if (previewMode === "desktop")
      return { w: DESKTOP_WIDTH, h: DESKTOP_HEIGHT };
    if (previewMode === "mobile") return { w: MOBILE_WIDTH, h: MOBILE_HEIGHT };
    // default는 “폭 고정 없음” (컨테이너 반응형)
    return { w: null as number | null, h: basePreviewHeight };
  }, [previewMode, basePreviewHeight]);

  // desktop/mobile 모드에서만 scale 적용
  const scale = useMemo(() => {
    if (previewMode === "default") return 1;
    if (!wrapWidth) return 1;
    const w = targetSize.w ?? wrapWidth;
    return Math.min(1, wrapWidth / w);
  }, [previewMode, wrapWidth, targetSize.w]);

  // 실제 보여질(축소된) 높이
  const visibleHeight = useMemo(() => {
    if (previewMode === "default") return basePreviewHeight;
    return Math.round((targetSize.h ?? basePreviewHeight) * scale);
  }, [previewMode, basePreviewHeight, targetSize.h, scale]);

  // 내부(실제 렌더링) 높이
  const innerHeight = useMemo(() => {
    if (previewMode === "default") return basePreviewHeight;
    return targetSize.h ?? basePreviewHeight;
  }, [previewMode, basePreviewHeight, targetSize.h]);

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

        {/* 3단계 모드 버튼 */}
        <div className="w-full mt-2 grid grid-cols-3 gap-2">
          <button
            type="button"
            className={`py-2 text-sm font-bold rounded-lg border ${
              previewMode === "default"
                ? "bg-indigo-200 border-indigo-300"
                : "bg-white/10 border-black/10"
            }`}
            onClick={() => setPreviewMode("default")}
          >
            일반 보기
          </button>

          <button
            type="button"
            className={`py-2 text-sm font-bold rounded-lg border ${
              previewMode === "desktop"
                ? "bg-indigo-200 border-indigo-300"
                : "bg-white/10 border-black/10"
            }`}
            onClick={() => setPreviewMode("desktop")}
          >
            PC 형태
          </button>

          <button
            type="button"
            className={`py-2 text-sm font-bold rounded-lg border ${
              previewMode === "mobile"
                ? "bg-indigo-200 border-indigo-300"
                : "bg-white/10 border-black/10"
            }`}
            onClick={() => setPreviewMode("mobile")}
          >
            모바일 사이즈
          </button>
        </div>

        {/* Preview 래퍼 */}
        <div
          ref={previewWrapRef}
          className="w-full mt-3 overflow-hidden rounded-xl border border-black/10"
          style={{ height: visibleHeight }}
        >
          {/* default: 그냥 꽉 차게
              desktop/mobile: 내부를 폭 고정 렌더링 후 scale */}
          <div
            style={{
              width: previewMode === "default" ? "100%" : targetSize.w!,
              height: innerHeight,
              transform: previewMode === "default" ? "none" : `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <SandpackPreview
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
};

export default SandpackRunner;
