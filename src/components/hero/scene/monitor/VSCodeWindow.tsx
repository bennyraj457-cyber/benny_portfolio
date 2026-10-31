import { useEffect, useState } from 'react'
import {
  Bell,
  Blocks,
  BugPlay,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  FileCode2,
  Files,
  Folder,
  FolderOpen,
  GitBranch,
  Search,
  Settings,
  Terminal,
  UserCircle2,
  X,
} from 'lucide-react'

const TYPED_SNIPPETS = [
  'className="btn-primary rounded-full px-6 py-2.5"',
  'className="btn-primary rounded-full px-6 py-2.5 shadow-sm"',
  'className="btn-primary rounded-full px-6 py-2.5 hover:bg-primary-fixed"',
]

const TERMINAL_LOGS = [
  '17:11:04 [vite] hmr update /src/components/Hero.tsx, /src/index.css',
  '17:11:08 [vite] hmr update /src/components/Projects.tsx (x2)',
  '17:11:12 [tsc]  0 errors — types synchronized with Figma tokens',
  '17:11:16 [vite] page reload /src/App.tsx (fast refresh 14ms)',
]

export function VSCodeWindow() {
  const [typedText, setTypedText] = useState(TYPED_SNIPPETS[0])
  const [activeLine, setActiveLine] = useState<number>(11)
  const [logIndex, setLogIndex] = useState<number>(0)

  // Slow, realistic typing and active-line progression
  useEffect(() => {
    let snippetIdx = 0
    let charIdx = 28
    let forward = true

    const typeTimer = window.setInterval(() => {
      const target = TYPED_SNIPPETS[snippetIdx]
      if (forward) {
        charIdx++
        if (charIdx >= target.length) {
          forward = false
        }
      } else {
        charIdx--
        if (charIdx <= 24) {
          forward = true
          snippetIdx = (snippetIdx + 1) % TYPED_SNIPPETS.length
        }
      }
      setTypedText(target.slice(0, charIdx))
    }, 110)

    const lineTimer = window.setInterval(() => {
      setActiveLine((prev) => (prev === 11 ? 9 : prev === 9 ? 14 : 11))
      setLogIndex((prev) => (prev + 1) % TERMINAL_LOGS.length)
    }, 3400)

    return () => {
      window.clearInterval(typeTimer)
      window.clearInterval(lineTimer)
    }
  }, [])

  const colNumber = 14 + typedText.length

  return (
    <div className="w-1/2 h-full bg-[#18181b] text-[#d4d4d8] flex flex-col border-r border-[#2d2d33] select-none overflow-hidden font-mono text-[9.5px] leading-[1.35]">
      {/* 1. Top Title & Editor Tab Bar */}
      <div className="h-[24px] bg-[#141417] border-b border-[#27272c] flex items-center justify-between px-2 shrink-0">
        {/* macOS Window Traffic Lights + Workspace Title */}
        <div className="flex items-center gap-1.5 pr-2">
          <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
          <span className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
          <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
          <span className="ml-1.5 text-[8.5px] text-[#8e8e98] font-semibold tracking-tight">
            VS Code — aureolin-portfolio
          </span>
        </div>

        {/* Open Editor Tabs */}
        <div className="flex items-center h-full overflow-hidden">
          {[
            { name: 'Hero.tsx', active: true, color: '#38bdf8' },
            { name: 'Header.tsx', active: false, color: '#38bdf8' },
            { name: 'Projects.tsx', active: false, color: '#38bdf8' },
            { name: 'App.tsx', active: false, color: '#38bdf8' },
            { name: 'index.css', active: false, color: '#a855f7' },
          ].map((tab) => (
            <div
              key={tab.name}
              className={`h-full px-2 flex items-center gap-1 border-r border-[#25252b] text-[8.5px] ${
                tab.active
                  ? 'bg-[#1e1e22] text-[#fbf9f3] border-t-2 border-t-[#f5d000]'
                  : 'bg-[#141417] text-[#787882]'
              }`}
            >
              <FileCode2
                className="w-2.5 h-2.5 shrink-0"
                style={{ color: tab.color }}
              />
              <span>{tab.name}</span>
              {tab.active && <X className="w-2 h-2 ml-0.5 text-[#787882]" />}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main IDE Body (Activity Bar + File Explorer + Code Editor + Minimap) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Activity Bar */}
        <div className="w-[24px] bg-[#141417] border-r border-[#25252b] flex flex-col items-center justify-between py-2 shrink-0 text-[#6e6e77]">
          <div className="flex flex-col items-center gap-2.5">
            <div className="relative text-[#fbf9f3]">
              <span className="absolute -left-[6px] top-0 bottom-0 w-[2px] bg-[#f5d000]" />
              <Files className="w-3 h-3" />
            </div>
            <Search className="w-3 h-3" />
            <GitBranch className="w-3 h-3 text-[#cbe6d0]" />
            <BugPlay className="w-3 h-3" />
            <Blocks className="w-3 h-3" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <UserCircle2 className="w-3 h-3" />
            <Settings className="w-3 h-3" />
          </div>
        </div>

        {/* File Explorer Sidebar */}
        <div className="w-[104px] bg-[#16161a] border-r border-[#25252b] flex flex-col shrink-0 py-1.5 px-1.5 text-[8.5px]">
          <div className="text-[7.5px] font-bold tracking-wider text-[#787882] uppercase mb-1 px-1 flex items-center justify-between">
            <span>EXPLORER</span>
          </div>

          <div className="flex items-center gap-0.5 text-[#d4d4d8] font-bold py-0.5">
            <ChevronDown className="w-2.5 h-2.5 text-[#787882]" />
            <span>MY-PORTFOLIO</span>
          </div>

          <div className="pl-2 space-y-0.5 mt-0.5">
            <div className="flex items-center gap-1 text-[#9ca3af]">
              <ChevronDown className="w-2.5 h-2.5" />
              <FolderOpen className="w-2.5 h-2.5 text-[#f5d000]" />
              <span>src</span>
            </div>

            <div className="pl-2.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[#9ca3af]">
                <ChevronDown className="w-2.5 h-2.5" />
                <FolderOpen className="w-2.5 h-2.5 text-[#cbe6d0]" />
                <span>components</span>
              </div>

              <div className="pl-3 space-y-0.5">
                <div className="flex items-center gap-1 text-[#9ca3af] px-1 py-0.5 rounded">
                  <FileCode2 className="w-2.5 h-2.5 text-[#38bdf8]" />
                  <span>Header.tsx</span>
                </div>
                <div className="flex items-center gap-1 bg-[#27272f] text-[#fbf9f3] px-1 py-0.5 rounded border-l-2 border-[#f5d000]">
                  <FileCode2 className="w-2.5 h-2.5 text-[#38bdf8]" />
                  <span>Hero.tsx</span>
                </div>
                <div className="flex items-center gap-1 text-[#9ca3af] px-1 py-0.5 rounded">
                  <FileCode2 className="w-2.5 h-2.5 text-[#38bdf8]" />
                  <span>Projects.tsx</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#9ca3af] px-1">
                <FileCode2 className="w-2.5 h-2.5 text-[#38bdf8]" />
                <span>App.tsx</span>
              </div>
              <div className="flex items-center gap-1 text-[#9ca3af] px-1">
                <FileCode2 className="w-2.5 h-2.5 text-[#a855f7]" />
                <span>index.css</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[#787882] pt-0.5">
              <ChevronRight className="w-2.5 h-2.5" />
              <Folder className="w-2.5 h-2.5 text-[#787882]" />
              <span>public</span>
            </div>
            <div className="flex items-center gap-1 text-[#787882] pl-3">
              <span>design-system.md</span>
            </div>
          </div>
        </div>

        {/* Center Syntax-Highlighted Code Editor */}
        <div className="flex-1 bg-[#1e1e22] flex flex-col min-w-0 overflow-hidden relative">
          {/* Breadcrumb Trail */}
          <div className="h-[16px] px-2 flex items-center gap-1 text-[8px] text-[#787882] border-b border-[#25252b] bg-[#1b1b1f]">
            <span>src</span>
            <ChevronRight className="w-2 h-2" />
            <span>components</span>
            <ChevronRight className="w-2 h-2" />
            <span className="text-[#d4d4d8]">Hero.tsx</span>
            <ChevronRight className="w-2 h-2" />
            <span className="text-[#f5d000]">PortfolioHero</span>
          </div>

          {/* Code Lines + Minimap */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Code Lines Container */}
            <div className="flex-1 py-1.5 px-1 overflow-hidden text-[9px] leading-[14.5px]">
              {/* Line 1 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">1</span>
                <span>
                  <span className="text-[#c084fc]">import</span>{' '}
                  <span className="text-[#e4e2dd]">{'{ Header }'}</span>{' '}
                  <span className="text-[#c084fc]">from</span>{' '}
                  <span className="text-[#86efac]">&apos;./Header&apos;</span>
                </span>
              </div>

              {/* Line 2 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">2</span>
                <span>
                  <span className="text-[#c084fc]">import</span>{' '}
                  <span className="text-[#e4e2dd]">{'{ Projects }'}</span>{' '}
                  <span className="text-[#c084fc]">from</span>{' '}
                  <span className="text-[#86efac]">&apos;./Projects&apos;</span>
                </span>
              </div>

              {/* Line 3 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">3</span>
                <span className="text-[#6b7280] italic">
                  {'// Synced with Figma Frame: Aureolin_Portfolio_v2'}
                </span>
              </div>

              {/* Line 4 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">4</span>
                <span>
                  <span className="text-[#c084fc]">export function</span>{' '}
                  <span className="text-[#fde047]">PortfolioHero</span>
                  <span className="text-[#e4e2dd]">() {'{'}</span>
                </span>
              </div>

              {/* Line 5 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">5</span>
                <span className="pl-2">
                  <span className="text-[#c084fc]">return</span>{' '}
                  <span className="text-[#e4e2dd]">(</span>
                </span>
              </div>

              {/* Line 6 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">6</span>
                <span className="pl-4">
                  <span className="text-[#38bdf8]">&lt;section</span>{' '}
                  <span className="text-[#fcd34d]">className</span>=
                  <span className="text-[#86efac]">
                    &quot;bg-surface text-on-surface px-14 py-12&quot;
                  </span>
                  <span className="text-[#38bdf8]">&gt;</span>
                </span>
              </div>

              {/* Line 7 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">7</span>
                <span className="pl-6">
                  <span className="text-[#38bdf8]">&lt;Header</span>{' '}
                  <span className="text-[#fcd34d]">status</span>=
                  <span className="text-[#86efac]">&quot;AVAILABLE&quot;</span>{' '}
                  <span className="text-[#38bdf8]">/&gt;</span>
                </span>
              </div>

              {/* Line 8 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">8</span>
                <span className="pl-6">
                  <span className="text-[#38bdf8]">&lt;span</span>{' '}
                  <span className="text-[#fcd34d]">className</span>=
                  <span className="text-[#86efac]">&quot;chip-specimen&quot;</span>
                  <span className="text-[#38bdf8]">&gt;</span>
                  <span className="text-[#fbf9f3]">AUREOLIN BOTANICA</span>
                  <span className="text-[#38bdf8]">&lt;/span&gt;</span>
                </span>
              </div>

              {/* Line 9 */}
              <div
                className={`flex items-center px-1 ${
                  activeLine === 9 ? 'bg-[#282830]' : ''
                }`}
              >
                <span className="w-5 text-right pr-2 text-[#52525b]">9</span>
                <span className="pl-6">
                  <span className="text-[#38bdf8]">&lt;h1</span>{' '}
                  <span className="text-[#fcd34d]">className</span>=
                  <span className="text-[#86efac]">
                    &quot;font-serif text-display-hero&quot;
                  </span>
                  <span className="text-[#38bdf8]">&gt;</span>
                </span>
              </div>

              {/* Line 10 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">10</span>
                <span className="pl-8 text-[#fbf9f3]">
                  Digital Craft &amp; Creative Engineering
                </span>
              </div>

              {/* Line 11 — Active Live Typing Line */}
              <div
                className={`flex items-center px-1 ${
                  activeLine === 11
                    ? 'bg-[#2a2a33] border-l-2 border-[#f5d000]'
                    : ''
                }`}
              >
                <span className="w-5 text-right pr-2 text-[#f5d000] font-bold">
                  11
                </span>
                <span className="pl-6 flex items-center">
                  <span className="text-[#38bdf8]">&lt;button</span>
                  <span className="ml-1 text-[#86efac]">{typedText}</span>
                  <span className="inline-block w-[5px] h-[11px] bg-[#f5d000] ml-0.5 animate-pulse" />
                  <span className="text-[#38bdf8]">&gt;</span>
                </span>
              </div>

              {/* Line 12 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">12</span>
                <span className="pl-8 text-[#fbf9f3]">Explore Works</span>
              </div>

              {/* Line 13 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">13</span>
                <span className="pl-6">
                  <span className="text-[#38bdf8]">&lt;/button&gt;</span>
                </span>
              </div>

              {/* Line 14 */}
              <div
                className={`flex items-center px-1 ${
                  activeLine === 14 ? 'bg-[#282830]' : ''
                }`}
              >
                <span className="w-5 text-right pr-2 text-[#52525b]">14</span>
                <span className="pl-6">
                  <span className="text-[#38bdf8]">&lt;Projects</span>{' '}
                  <span className="text-[#fcd34d]">columns</span>=
                  <span className="text-[#f5d000]">{'{2}'}</span>{' '}
                  <span className="text-[#38bdf8]">/&gt;</span>
                </span>
              </div>

              {/* Line 15 */}
              <div className="flex items-center px-1">
                <span className="w-5 text-right pr-2 text-[#52525b]">15</span>
                <span className="pl-4">
                  <span className="text-[#38bdf8]">&lt;/section&gt;</span>
                </span>
              </div>
            </div>

            {/* Right Code Minimap */}
            <div className="w-[34px] bg-[#19191d] border-l border-[#25252b] p-1 flex flex-col gap-[3px] shrink-0 opacity-80">
              <div className="w-full h-3 bg-[#f5d000]/15 border border-[#f5d000]/40 rounded-[1px]" />
              {Array.from({ length: 18 }).map((_, idx) => (
                <div key={idx} className="flex gap-0.5">
                  <span
                    className="h-[2px] rounded-full"
                    style={{
                      width: `${8 + ((idx * 7) % 16)}px`,
                      backgroundColor:
                        idx % 4 === 0
                          ? '#38bdf8'
                          : idx % 3 === 0
                            ? '#f5d000'
                            : '#52525b',
                    }}
                  />
                  <span className="h-[2px] w-2 bg-[#3f3f46] rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Integrated Bottom Terminal Panel */}
          <div className="h-[68px] bg-[#141417] border-t border-[#27272c] flex flex-col px-2.5 py-1 shrink-0">
            <div className="flex items-center justify-between text-[7.5px] text-[#787882] border-b border-[#222227] pb-0.5 mb-1">
              <div className="flex items-center gap-3 uppercase font-bold tracking-wider">
                <span>PROBLEMS 0</span>
                <span>OUTPUT</span>
                <span className="text-[#fbf9f3] border-b border-[#f5d000] pb-0.5">
                  TERMINAL
                </span>
                <span>PORTS: 5173</span>
              </div>
              <div className="flex items-center gap-1 text-[#cbe6d0]">
                <Terminal className="w-2.5 h-2.5" />
                <span>pwsh — vite</span>
              </div>
            </div>

            <div className="space-y-0.5 text-[8px] leading-[11px] font-mono">
              <div className="text-[#86efac]">
                ➜ Local:{' '}
                <span className="underline text-[#38bdf8]">
                  http://localhost:5173/
                </span>{' '}
                <span className="text-[#787882]">
                  • Stitch Design Tokens Loaded
                </span>
              </div>
              <div className="text-[#d4d4d8] flex items-center gap-1.5">
                <span className="text-[#f5d000]">●</span>
                <span>{TERMINAL_LOGS[logIndex]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom VS Code Status Bar */}
      <div className="h-[16px] bg-[#121215] border-t border-[#27272c] px-2 flex items-center justify-between text-[7.5px] text-[#9ca3af] shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-0.5 text-[#cbe6d0] font-bold">
            <GitBranch className="w-2.5 h-2.5" />
            <span>main*</span>
          </span>
          <span>⊗ 0 ⚠ 0</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[#fbf9f3]">
            Ln {activeLine}, Col {colNumber}
          </span>
          <span>UTF-8</span>
          <span className="text-[#38bdf8]">TypeScript JSX</span>
          <span className="flex items-center gap-0.5 text-[#f5d000]">
            <CheckCheck className="w-2.5 h-2.5" />
            <span>Prettier</span>
          </span>
          <Bell className="w-2.5 h-2.5" />
        </div>
      </div>
    </div>
  )
}

