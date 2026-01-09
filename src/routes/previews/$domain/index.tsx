import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/previews/$domain/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/previews/$domain/"!</div>;
}
