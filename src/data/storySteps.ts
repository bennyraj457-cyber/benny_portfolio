export type StoryStepId =
  | 'door'
  | 'room-overview'
  | 'notebook'
  | 'bookshelf'
  | 'music-player'
  | 'smartphone'
  | 'wall-art'

export interface StoryStep {
  id: StoryStepId
  stepNumber: number
  title: string
  subtitle: string
  category: string
  hint: string
}

export const STORY_STEPS: StoryStep[] = [
  {
    id: 'door',
    stepNumber: 1,
    title: 'Studio Entrance',
    subtitle: 'Private Lab & Workspace 01',
    category: 'STUDIO ENTRANCE',
    hint: 'Scroll down to enter the room',
  },
  {
    id: 'room-overview',
    stepNumber: 2,
    title: 'Creative Studio',
    subtitle: '3D Workspace & Design Lab',
    category: 'OVERVIEW',
    hint: 'Scroll to explore interactive tools',
  },
  {
    id: 'notebook',
    stepNumber: 3,
    title: 'About Me Notebook',
    subtitle: 'Creative Developer & UI/UX Designer',
    category: 'BIOGRAPHY & PHILOSOPHY',
    hint: 'Flip pages or scroll to continue',
  },
  {
    id: 'bookshelf',
    stepNumber: 4,
    title: 'Skills & Tech Stack',
    subtitle: 'React • Three.js • TypeScript • UI/UX',
    category: 'KNOWLEDGE & CAPABILITIES',
    hint: 'Click books or scroll to next station',
  },
  {
    id: 'music-player',
    stepNumber: 5,
    title: 'Vintage Gramophone',
    subtitle: 'Soundtrack & Ambient Audio',
    category: 'AUDIO & AMBIENCE',
    hint: 'Play songs or scroll to contact',
  },
  {
    id: 'smartphone',
    stepNumber: 6,
    title: "Let's Connect",
    subtitle: 'Direct Messaging & Social Links',
    category: 'COMMUNICATION',
    hint: 'Send a message or scroll to gallery',
  },
  {
    id: 'wall-art',
    stepNumber: 7,
    title: 'Framed Gallery Art',
    subtitle: 'Live Artwork from Supabase',
    category: 'EXHIBITION',
    hint: 'Scroll up to revisit previous stations',
  },
]

