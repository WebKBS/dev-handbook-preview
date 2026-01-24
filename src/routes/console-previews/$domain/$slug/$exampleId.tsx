import SandpackConsoleRunner from "@/features/preview/components/SandpackConsoleRunner.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/console-previews/$domain/$slug/$exampleId",
)({
  component: PreviewExamplePage,
});

function PreviewExamplePage() {
  const { domain, slug, exampleId } = Route.useParams();
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: 16,
        paddingBottom: 48,
      }}
    >
      <SandpackConsoleRunner
        domain={domain}
        slug={slug}
        exampleId={exampleId}
      />
    </div>
  );
}
