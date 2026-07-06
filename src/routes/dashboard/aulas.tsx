import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/aulas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/aulas"!</div>
}
