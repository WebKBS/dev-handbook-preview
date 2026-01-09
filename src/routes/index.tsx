import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Link
        to={"/previews/$domain/$slug/$exampleId"}
        params={{
          domain: "html",
          slug: "what-is-html",
          exampleId: "ex-important",
        }}
      >
        Go to /previews/$domain/$slug/$exampleId
      </Link>
    </div>
  );
}


