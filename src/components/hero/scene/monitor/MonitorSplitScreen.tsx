import { VSCodeWindow } from './VSCodeWindow'
import { FigmaWindow } from './FigmaWindow'

/**
 * 1050 × 425 px (exact 0.84m × 0.34m 21:9 aspect ratio) split-screen desktop workspace:
 * - Left 50%: Visual Studio Code actively coding the Aureolin Botanica React portfolio
 * - Right 50%: Figma actively designing the same Aureolin Botanica desktop frame
 */
export function MonitorSplitScreen() {
  return (
    <div
      className="w-[1050px] h-[425px] bg-[#141417] flex flex-row overflow-hidden rounded-[2px] shadow-inner pointer-events-none select-none"
      style={{
        WebkitFontSmoothing: 'antialiased',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Left 50%: VS Code */}
      <VSCodeWindow />

      {/* Right 50%: Figma */}
      <FigmaWindow />
    </div>
  )
}

