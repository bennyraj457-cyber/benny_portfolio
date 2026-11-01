export type StoryStepId =
  | 'door'
  | 'room-overview'
  | 'bike-showroom'
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
    id: 'bike-showroom',
    stepNumber: 3,
    title: '1970 Honda CB750 & Glass Patio',
    subtitle: 'Classic Super Sport & Sunlight Terrace Door',
    category: 'GARAGE SHOWCASE',
    hint: 'Click the glass door to open/close or click Next',
  },
  {
    id: 'notebook',
    stepNumber: 4,
    title: 'About Me Notebook',
    subtitle: 'Creative Developer & UI/UX Designer',
    category: 'BIOGRAPHY & PHILOSOPHY',
    hint: 'Flip pages or click Next to continue',
  },
  {
    id: 'bookshelf',
    stepNumber: 5,
    title: 'Skills & Tech Stack',
    subtitle: 'React • Three.js • TypeScript • UI/UX',
    category: 'KNOWLEDGE & CAPABILITIES',
    hint: 'Click any book to read or click Next',
  },
  {
    id: 'music-player',
    stepNumber: 6,
    title: 'Vintage Gramophone',
    subtitle: 'Soundtrack & Ambient Audio',
    category: 'AUDIO & AMBIENCE',
    hint: 'Play songs or click Next to continue',
  },
  {
    id: 'smartphone',
    stepNumber: 7,
    title: "Let's Connect",
    subtitle: 'Direct Messaging & Social Links',
    category: 'COMMUNICATION',
    hint: 'Send a message or click Next to continue',
  },
  {
    id: 'wall-art',
    stepNumber: 8,
    title: 'Framed Gallery Art',
    subtitle: 'Live Artwork from Supabase',
    category: 'EXHIBITION',
    hint: 'Click Next to view notice or Prev to go back',
  },
  {
    id: 'wall-note',
    stepNumber: 9,
    title: 'Studio Notice',
    subtitle: 'Workspace Expansion & Updates',
    category: 'NOTICE BOARD',
    hint: 'Click Next to restart tour or Prev to go back',
  },
]

