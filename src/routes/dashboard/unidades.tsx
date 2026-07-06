import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/unidades')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/unidades"!</div>
}
