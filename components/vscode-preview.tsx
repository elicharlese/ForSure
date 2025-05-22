"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface VSCodePreviewProps {
  className?: string
}

export default function VSCodePreview({ className }: VSCodePreviewProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden border border-primary/20 transition-all duration-300",
        isHovered && "shadow-lg shadow-primary/20",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-secondary-dark p-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs text-white/70 font-mono flex-1 text-center truncate">
          project.forsure - Visual Studio Code
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-48 bg-secondary-dark/90 p-2 text-white/80 text-xs">
          <div className="mb-2 font-semibold">EXPLORER</div>
          <div className="pl-2">
            <div className="mb-1">📁 src</div>
            <div className="pl-2 mb-1">📄 index.js</div>
            <div className="pl-2 mb-1">📁 utils</div>
            <div className="mb-1">📁 assets</div>
            <div className="mb-1">📄 project.forsure</div>
            <div className="mb-1">📄 README.md</div>
          </div>
        </div>
        <div className="flex-1 bg-secondary p-2 overflow-x-auto">
          <pre className="text-xs text-white font-mono">
            <code>{`root:
# Main source code directory
- src:
    - index.js { entry: true }
    - utils:
        # Utility scripts
        - helpers.js
        - date.js { timezone: "UTC" }
# Assets for front-end design
- assets:
    - logo.svg
    - css:
        # Style sheets
        - theme.css
# Documentation file
- README.md`}</code>
          </pre>
        </div>
      </div>
      <div className="bg-secondary-dark/80 p-1 flex items-center text-xs text-white/60 border-t border-white/10">
        <div className="flex-1">ForSure</div>
        <div>UTF-8</div>
      </div>
    </div>
  )
}
