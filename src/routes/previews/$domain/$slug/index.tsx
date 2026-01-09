import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/previews/$domain/$slug/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/previews/ $domain/$slug/ index"!</div>
}
