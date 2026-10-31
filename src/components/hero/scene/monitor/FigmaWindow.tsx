import { useEffect, useState } from 'react'
import {
  AlignLeft,
  ChevronDown,
  Frame,
  Hand,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  MousePointer,
  PenTool,
  Play,
  Square,
  Type,
} from 'lucide-react'

type SelectedNodeId = 'hero' | 'button' | 'cards'

interface NodeSpec {
  id: SelectedNodeId
  layerName: string
  w: number
  h: number
  x: number
  y: number
  radius: number
  padding: number
  fillHex: string
  fillName: string
  cursorX: number
  cursorY: number
}

const NODE_SPECS: Record<SelectedNodeId, NodeSpec> = {
  hero: {
    id: 'hero',
    layerName: 'Hero_Typography',
    w: 248,
    h: 58,
    x: 24,
    y: 44,
    radius: 8,
    padding: 16,
    fillHex: '#1B1C19',
    fillName: 'on-surface',
    cursorX: 118,
    cursorY: 78,
  },
  button: {
    id: 'button',
    layerName: 'CTA_Button_Primary',
    w: 112,
    h: 28,
    x: 24,
    y: 112,
    radius: 999,
    padding: 20,
    fillHex: '#F5D000',
    fillName: 'primary-container',
    cursorX: 82,
    cursorY: 116,
  },
  cards: {
    id: 'cards',
    layerName: 'Projects_Grid_2Col',
    w: 248,
    h: 82,
    x: 24,
    y: 152,
    radius: 16,
    padding: 24,
    fillHex: '#F5F3EE',
    fillName: 'surface-container-low',
    cursorX: 174,
    cursorY: 172,
  },
}

const SELECTION_ORDER: SelectedNodeId[] = ['button', 'hero', 'cards']

export function FigmaWindow() {
  const [selectedId, setSelectedId] = useState<SelectedNodeId>('button')
  const [propDelta, setPropDelta] = useState<number>(0)

  // Slow, realistic design cycle: cursor moves between elements, selects them, and tweaks a property
  useEffect(() => {
    let idx = 0
    const selectTimer = window.setInterval(() => {
      idx = (idx + 1) % SELECTION_ORDER.length
      setSelectedId(SELECTION_ORDER[idx])
    }, 3600)

    const deltaTimer = window.setInterval(() => {
      setPropDelta((prev) => (prev === 0 ? 2 : prev === 2 ? -2 : 0))
    }, 1800)

    return () => {
      window.clearInterval(selectTimer)
      window.clearInterval(deltaTimer)
    }
  }, [])

  const activeSpec = NODE_SPECS[selectedId]

  return (
    <div className="w-1/2 h-full bg-[#1e1e1e] text-[#e5e5e5] flex flex-col select-none overflow-hidden font-mono text-[9px] leading-[1.3]">
      {/* 1. Top Figma Application Toolbar */}
      <div className="h-[24px] bg-[#2c2c2c] border-b border-[#383838] flex items-center justify-between px-2 shrink-0">
        {/* Left Tool Icons */}
        <div className="flex items-center gap-1">
          <div className="p-1 rounded bg-[#0d99ff] text-white">
            <MousePointer className="w-2.5 h-2.5" />
          </div>
          <div className="p-1 rounded text-[#b3b3b3]">
            <Frame className="w-2.5 h-2.5" />
          </div>
          <div className="p-1 rounded text-[#b3b3b3]">
            <Square className="w-2.5 h-2.5" />
          </div>
          <div className="p-1 rounded text-[#b3b3b3]">
            <PenTool className="w-2.5 h-2.5" />
          </div>
          <div className="p-1 rounded text-[#b3b3b3]">
            <Type className="w-2.5 h-2.5" />
          </div>
          <div className="p-1 rounded text-[#b3b3b3]">
            <Hand className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* Center File Title */}
        <div className="flex items-center gap-1 text-[8.5px]">
          <span className="text-[#999999]">Drafts /</span>
          <span className="text-white font-bold">Aureolin_Portfolio_v2</span>
          <ChevronDown className="w-2.5 h-2.5 text-[#999999]" />
        </div>

        {/* Right Actions & Zoom */}
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-[#f5d000] text-[#1b1c19] font-bold text-[7.5px] flex items-center justify-center">
            B
          </span>
          <Play className="w-2.5 h-2.5 text-[#b3b3b3]" />
          <span className="px-1.5 py-0.5 rounded bg-[#0d99ff] text-white text-[7.5px] font-bold">
            Share
          </span>
          <span className="text-[8px] text-[#b3b3b3]">75%</span>
        </div>
      </div>

      {/* 2. Main Figma Workspace (Left Layers + Center Canvas + Right Properties) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar: Pages & Layers */}
        <div className="w-[106px] bg-[#252525] border-r border-[#383838] flex flex-col shrink-0 py-1.5 px-1.5 text-[8px]">
          {/* Pages Section */}
          <div className="pb-1.5 mb-1.5 border-b border-[#383838]">
            <div className="text-[7px] font-bold uppercase tracking-wider text-[#8c8c8c] mb-1 px-1">
              Pages
            </div>
            <div className="px-1 py-0.5 rounded bg-[#383838] text-white flex items-center justify-between">
              <span>01 // Desktop Web</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5d000]" />
            </div>
            <div className="px-1 py-0.5 text-[#8c8c8c]">02 // Stitch Tokens</div>
          </div>

          {/* Layers Hierarchy */}
          <div className="text-[7px] font-bold uppercase tracking-wider text-[#8c8c8c] mb-1 px-1 flex items-center gap-1">
            <Layers className="w-2.5 h-2.5" />
            <span>Layers</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[#d4d4d8] font-bold px-1 py-0.5">
              <Frame className="w-2.5 h-2.5 text-[#0d99ff]" />
              <span>Desktop - 1440</span>
            </div>

            <div className="pl-2 space-y-0.5">
              {/* Header Layer */}
              <div className="flex items-center gap-1 px-1 py-0.5 rounded text-[#b3b3b3]">
                <LayoutGrid className="w-2.5 h-2.5 text-[#a855f7]" />
                <span>Header_Nav</span>
              </div>

              {/* Hero Layer */}
              <div
                className={`flex items-center gap-1 px-1 py-0.5 rounded ${
                  selectedId === 'hero'
                    ? 'bg-[#0d99ff]/25 text-white border-l-2 border-[#0d99ff]'
                    : 'text-[#b3b3b3]'
                }`}
              >
                <Type className="w-2.5 h-2.5 text-[#38bdf8]" />
                <span>Hero_Typography</span>
              </div>

              {/* Primary CTA Button Layer */}
              <div
                className={`flex items-center gap-1 px-1 py-0.5 rounded ${
                  selectedId === 'button'
                    ? 'bg-[#0d99ff]/25 text-white border-l-2 border-[#0d99ff]'
                    : 'text-[#b3b3b3]'
                }`}
              >
                <Square className="w-2.5 h-2.5 text-[#f5d000]" />
                <span>CTA_Button</span>
              </div>

              {/* Project Cards Grid Layer */}
              <div
                className={`flex items-center gap-1 px-1 py-0.5 rounded ${
                  selectedId === 'cards'
                    ? 'bg-[#0d99ff]/25 text-white border-l-2 border-[#0d99ff]'
                    : 'text-[#b3b3b3]'
                }`}
              >
                <LayoutGrid className="w-2.5 h-2.5 text-[#86efac]" />
                <span>Projects_Grid</span>
              </div>

              {/* Card Sub-layers */}
              <div className="pl-2.5 space-y-0.5 text-[#8c8c8c]">
                <div className="flex items-center gap-1 px-1">
                  <ImageIcon className="w-2 h-2" />
                  <span>Specimen_Card_01</span>
                </div>
                <div className="flex items-center gap-1 px-1">
                  <ImageIcon className="w-2 h-2" />
                  <span>Specimen_Card_02</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Figma Infinite Canvas with Website Artboard */}
        <div className="flex-1 bg-[#161616] relative flex items-center justify-center p-2.5 overflow-hidden">
          {/* Subtle Figma Dot Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(#787882 0.75px, transparent 0.75px)',
              backgroundSize: '10px 10px',
            }}
          />

          {/* Top & Left Pixel Rulers */}
          <div className="absolute top-0 left-0 right-0 h-[11px] bg-[#222222] border-b border-[#333333] flex items-center justify-around text-[6.5px] text-[#777777] px-4">
            <span>0</span>
            <span>360</span>
            <span>720</span>
            <span>1080</span>
            <span>1440</span>
          </div>

          {/* Desktop 1440 Artboard Frame — Connected to the exact React code in VS Code! */}
          <div className="relative w-full max-w-[274px] h-[238px] mt-2 bg-[#fbf9f3] text-[#1b1c19] rounded-[3px] shadow-lg border border-[#383838] flex flex-col justify-between p-2.5 overflow-visible">
            {/* Artboard Frame Label Above Top-Left Corner */}
            <div className="absolute -top-3.5 left-0 flex items-center gap-1.5 text-[7.5px] text-[#0d99ff] font-bold">
              <span>Desktop - 1440 × 900</span>
              <span className="text-[#8c8c8c]">• Component #PortfolioHero</span>
            </div>

            {/* 1. Website Header inside Figma Canvas (matches <Header status="AVAILABLE" />) */}
            <div className="h-[20px] rounded-full bg-[#f0eee8] border border-[#cfc6ab]/60 px-2.5 flex items-center justify-between text-[7px]">
              <div className="flex items-center gap-1 font-bold text-[#1b1c19]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f5d000]" />
                <span>AUREOLIN // STUDIO</span>
              </div>
              <div className="flex items-center gap-2 text-[#4c4732]">
                <span>01. INDEX</span>
                <span>02. WORKS</span>
                <span>03. LAB</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-[#cbe6d0] text-[#506856] font-bold text-[6.5px]">
                AVAILABLE
              </span>
            </div>

            {/* 2. Website Hero Section inside Figma Canvas (matches <PortfolioHero /> in VS Code) */}
            <div
              className={`relative rounded-[3px] p-1.5 transition-all duration-300 ${
                selectedId === 'hero'
                  ? 'ring-1 ring-[#0d99ff] bg-[#0d99ff]/[0.03]'
                  : ''
              }`}
            >
              {selectedId === 'hero' && (
                <>
                  <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                  <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                  <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                  <span className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-1 rounded bg-[#0d99ff] text-white text-[6.5px] font-bold whitespace-nowrap">
                    {activeSpec.w + propDelta} × {activeSpec.h}
                  </span>
                </>
              )}

              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#f0eee8] border border-[#cfc6ab] text-[6.5px] font-bold text-[#6f5d00] mb-1">
                <span>AUREOLIN BOTANICA</span>
              </div>

              <div className="font-serif text-[13px] leading-[1.15] text-[#1b1c19] font-normal tracking-tight">
                Digital Craft &amp;{' '}
                <span className="italic text-[#4c4732]">
                  Creative Engineering
                </span>
              </div>
            </div>

            {/* 3. Website Primary CTA Button (matches Line 11 in VS Code!) */}
            <div className="flex items-center gap-2 px-1.5">
              <div
                className={`relative inline-flex items-center gap-1 rounded-full bg-[#f5d000] text-[#6a5900] px-3 py-1 text-[7.5px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedId === 'button' ? 'ring-1 ring-[#0d99ff]' : ''
                }`}
              >
                {selectedId === 'button' && (
                  <>
                    <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                    <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                    <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                    <span className="absolute -right-11 top-1/2 -translate-y-1/2 px-1 rounded bg-[#0d99ff] text-white text-[6.5px] font-bold">
                      r: 999
                    </span>
                  </>
                )}
                <span>Explore Works</span>
              </div>

              <div className="inline-flex items-center rounded-full bg-[#f0eee8] text-[#1b1c19] border border-[#cfc6ab] px-2.5 py-1 text-[7px] font-bold uppercase">
                <span>Archive</span>
              </div>
            </div>

            {/* 4. Website Project Cards Grid (matches <Projects columns={2} /> in VS Code!) */}
            <div
              className={`relative grid grid-cols-2 gap-2 p-1 rounded-[4px] transition-all duration-300 ${
                selectedId === 'cards'
                  ? 'ring-1 ring-[#0d99ff] bg-[#0d99ff]/[0.03]'
                  : ''
              }`}
            >
              {selectedId === 'cards' && (
                <>
                  <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                  <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                  <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-white border border-[#0d99ff]" />
                </>
              )}

              {/* Project Card 01 */}
              <div className="rounded-[6px] bg-[#f5f3ee] border border-[#cfc6ab]/70 p-2 space-y-1">
                <div className="h-[26px] rounded-[4px] bg-[#30312d] flex items-center justify-between px-2">
                  <span className="w-4 h-4 rounded-full border border-[#f5d000]" />
                  <span className="text-[6px] text-[#f2f1eb]">01 // 3D STUDIO</span>
                </div>
                <div className="font-serif text-[8.5px] font-medium text-[#1b1c19]">
                  Spatial Workspace
                </div>
                <div className="text-[6.5px] text-[#4c4732]">
                  React Three Fiber • WebGL
                </div>
              </div>

              {/* Project Card 02 */}
              <div className="rounded-[6px] bg-[#f5f3ee] border border-[#cfc6ab]/70 p-2 space-y-1">
                <div className="h-[26px] rounded-[4px] bg-[#cbe6d0] flex items-center justify-between px-2">
                  <span className="w-4 h-1.5 rounded-full bg-[#4c6452]" />
                  <span className="text-[6px] text-[#354c3b] font-bold">
                    02 // SYSTEM
                  </span>
                </div>
                <div className="font-serif text-[8.5px] font-medium text-[#1b1c19]">
                  Aureolin Botanica
                </div>
                <div className="text-[6.5px] text-[#4c4732]">
                  Design Tokens • UI Kit
                </div>
              </div>
            </div>

            {/* Animated Designer Cursor Moving Across the Canvas */}
            <div
              className="pointer-events-none absolute z-30 transition-all duration-1000 ease-in-out"
              style={{
                left: `${activeSpec.cursorX + propDelta * 2}px`,
                top: `${activeSpec.cursorY}px`,
              }}
            >
              <MousePointer className="w-3.5 h-3.5 text-[#0d99ff] fill-[#0d99ff] -rotate-12 drop-shadow" />
              <div className="ml-2.5 -mt-1 px-1.5 py-0.5 rounded bg-[#0d99ff] text-white text-[6.5px] font-bold shadow whitespace-nowrap">
                Designer • Live
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Design / Prototype / Inspect Properties Panel */}
        <div className="w-[116px] bg-[#252525] border-l border-[#383838] flex flex-col shrink-0 py-1.5 px-2 text-[8px]">
          {/* Tabs: Design | Prototype | Inspect */}
          <div className="flex items-center justify-between border-b border-[#383838] pb-1 mb-1.5 text-[7.5px]">
            <span className="text-white font-bold border-b border-[#0d99ff] pb-0.5">
              Design
            </span>
            <span className="text-[#8c8c8c]">Prototype</span>
            <span className="text-[#8c8c8c]">Inspect</span>
          </div>

          {/* Alignment Row */}
          <div className="flex items-center justify-between text-[#999999] pb-1.5 mb-1.5 border-b border-[#333333]">
            <AlignLeft className="w-2.5 h-2.5" />
            <span>⊞</span>
            <span>⊟</span>
            <span>⊠</span>
            <span>⊡</span>
          </div>

          {/* Frame Dimensions (X, Y, W, H, Radius) */}
          <div className="pb-1.5 mb-1.5 border-b border-[#333333] space-y-1">
            <div className="text-[7.5px] text-[#0d99ff] font-bold truncate">
              {activeSpec.layerName}
            </div>
            <div className="grid grid-cols-2 gap-1 text-[7.5px]">
              <div className="bg-[#1e1e1e] px-1 py-0.5 rounded flex justify-between">
                <span className="text-[#777777]">X</span>
                <span>{activeSpec.x}</span>
              </div>
              <div className="bg-[#1e1e1e] px-1 py-0.5 rounded flex justify-between">
                <span className="text-[#777777]">Y</span>
                <span>{activeSpec.y}</span>
              </div>
              <div className="bg-[#1e1e1e] px-1 py-0.5 rounded flex justify-between border border-[#0d99ff]/50">
                <span className="text-[#777777]">W</span>
                <span className="text-white font-bold">
                  {activeSpec.w + propDelta}
                </span>
              </div>
              <div className="bg-[#1e1e1e] px-1 py-0.5 rounded flex justify-between">
                <span className="text-[#777777]">H</span>
                <span>{activeSpec.h}</span>
              </div>
              <div className="bg-[#1e1e1e] px-1 py-0.5 rounded flex justify-between col-span-2">
                <span className="text-[#777777]">Corner Radius</span>
                <span className="text-[#f5d000]">{activeSpec.radius}px</span>
              </div>
            </div>
          </div>

          {/* Auto Layout & Spacing */}
          <div className="pb-1.5 mb-1.5 border-b border-[#333333] space-y-1">
            <div className="text-[7px] font-bold uppercase text-[#8c8c8c]">
              Auto Layout
            </div>
            <div className="grid grid-cols-2 gap-1 text-[7.5px]">
              <div className="bg-[#1e1e1e] px-1 py-0.5 rounded flex justify-between">
                <span className="text-[#777777]">Gap</span>
                <span>12px</span>
              </div>
              <div className="bg-[#1e1e1e] px-1 py-0.5 rounded flex justify-between">
                <span className="text-[#777777]">Pad</span>
                <span>{activeSpec.padding + propDelta}px</span>
              </div>
            </div>
          </div>

          {/* Typography Token */}
          <div className="pb-1.5 mb-1.5 border-b border-[#333333] space-y-0.5">
            <div className="text-[7px] font-bold uppercase text-[#8c8c8c]">
              Typography
            </div>
            <div className="text-white font-bold text-[7.5px]">
              Newsreader / Space Mono
            </div>
            <div className="text-[#999999] text-[7px]">
              Regular • 4.5rem • -2.5%
            </div>
          </div>

          {/* Fill Swatch */}
          <div className="space-y-1">
            <div className="text-[7px] font-bold uppercase text-[#8c8c8c]">
              Fill — Stitch Token
            </div>
            <div className="flex items-center gap-1.5 bg-[#1e1e1e] p-1 rounded">
              <span
                className="w-3 h-3 rounded-[2px] border border-white/20 shrink-0"
                style={{ backgroundColor: activeSpec.fillHex }}
              />
              <div className="min-w-0">
                <div className="text-[7.5px] text-white font-bold truncate">
                  {activeSpec.fillHex}
                </div>
                <div className="text-[6.5px] text-[#8c8c8c] truncate">
                  {activeSpec.fillName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

