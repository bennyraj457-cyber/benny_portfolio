import { WorkspaceCanvas } from './WorkspaceCanvas'

interface HeroWorkspaceProps {
  onBackToHome?: () => void
}

export function HeroWorkspace({ onBackToHome }: HeroWorkspaceProps) {
  return (
    <section
      aria-label="3D Creative Workspace Hero"
      className="relative w-full h-screen bg-surface overflow-hidden"
    >
      <div className="absolute inset-0">
        <WorkspaceCanvas onBackToHome={onBackToHome} />
      </div>
    </section>
  )
}
