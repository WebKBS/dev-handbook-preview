import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/previews/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/previews/"!</div>
}
