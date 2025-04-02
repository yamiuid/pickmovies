"use client"

import { useEffect, useState } from "react"

export default function MovieBackgroundFlow() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  // 创建6列，每列5个矩形
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gray-950">
      <div className="absolute inset-0 grid grid-cols-6 gap-4 p-4">
        {[0, 1, 2, 3, 4, 5].map((colIndex) => (
          <div
            key={colIndex}
            className={`relative overflow-hidden ${colIndex % 2 === 0 ? "movie-scroll-down" : "movie-scroll-up"}`}
          >
            <div
              className={`flex flex-col gap-4 ${colIndex % 2 === 0 ? "animate-scroll-down" : "animate-scroll-up"}`}
              style={{
                animationDuration: `${30 + colIndex * 5}s`,
              }}
            >
              {/* 使用纯色矩形代替图片，确保可见性 */}
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="relative aspect-[2/3] mb-4 rounded-lg bg-white opacity-20"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

