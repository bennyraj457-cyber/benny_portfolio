export type StoryStepId =
  | 'door'
  | 'room-overview'
  | 'notebook'
  | 'bookshelf'
  | 'music-player'
  | 'smartphone'
  | 'wall-art'
  | 'wall-note'

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
    hint: 'Click Next or the door handle to enter the room',
  },
  {
    id: 'room-overview',
    stepNumber: 2,
    title: 'Creative Studio',
    subtitle: '3D Workspace & Design Lab',
    category: 'OVERVIEW',
    hint: 'Click Next to tour each station or click any object',
  },
  {
    id: 'notebook',
    stepNumber: 3,
    title: 'About Me Notebook',
    subtitle: 'Creative Developer & UI/UX Designer',
    category: 'BIOGRAPHY & PHILOSOPHY',
    hint: 'Flip pages or click Next to continue',
  },
  {
    id: 'bookshelf',
    stepNumber: 4,
    title: 'Skills & Tech Stack',
    subtitle: 'React • Three.js • TypeScript • UI/UX',
    category: 'KNOWLEDGE & CAPABILITIES',
    hint: 'Click any book to read or click Next',
  },
  {
    id: 'music-player',
    stepNumber: 5,
    title: 'Vintage Gramophone',
    subtitle: 'Soundtrack & Ambient Audio',
    category: 'AUDIO & AMBIENCE',
    hint: 'Play songs or click Next to continue',
  },
  {
    id: 'smartphone',
    stepNumber: 6,
    title: "Let's Connect",
    subtitle: 'Direct Messaging & Social Links',
    category: 'COMMUNICATION',
    hint: 'Send a message or click Next to continue',
  },
  {
    id: 'wall-art',
    stepNumber: 7,
    title: 'Framed Gallery Art',
    subtitle: 'Live Artwork from Supabase',
    category: 'EXHIBITION',
    hint: 'Click Next to view notice or Prev to go back',
  },
  {
    id: 'wall-note',
    stepNumber: 8,
    title: 'Studio Notice',
    subtitle: 'Workspace Expansion & Updates',
    category: 'NOTICE BOARD',
    hint: 'Click Next to restart tour or Prev to go back',
  },
]

