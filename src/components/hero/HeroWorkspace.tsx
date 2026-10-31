import { WorkspaceCanvas } from './WorkspaceCanvas'

export function HeroWorkspace() {
  return (
    <section
      aria-label="3D Creative Workspace Hero"
      className="relative w-full h-screen bg-surface overflow-hidden"
    >
      <div className="absolute inset-0">
        <WorkspaceCanvas />
      </div>
    </section>
  )
}
