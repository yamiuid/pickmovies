"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

// 经典电影海报数据 - TMDB路径
const classicMoviePosters = [
  // 第1列
  [
    "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", // The Godfather
    "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", // The Shawshank Redemption
    "/qJ2tW6WMUDux911r6m7haRef0WH.jpg", // The Dark Knight
    "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", // Pulp Fiction
    "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", // Schindler's List
  ],
  // 第2列
  [
    "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", // The Lord of the Rings
    "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", // Fight Club
    "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", // Inception
    "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg", // Goodfellas
    "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", // The Matrix
  ],
  // 第3列
  [
    "/6yoghtyTpznpBik8EngEmJskVUO.jpg", // Se7en
    "/rplLJ2hPcOQmkFhTqUte0MkEaO2.jpg", // The Silence of the Lambs
    "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", // Interstellar
    "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", // Parasite
    "/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg", // Gladiator
  ],
  // 第4列
  [
    "/bdN3gXuYP8qNxh5U0870A55xBDg.jpg", // The Prestige
    "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg", // The Departed
    "/6uSPcdGMY5qPVpgsmcPXRoHxG8c.jpg", // Whiplash
    "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", // Spirited Away
    "/5K7cOHoay2mZusSLezBOY0Qxh8a.jpg", // Casablanca
  ],
  // 第5列
  [
    "/vFJ74JL7XtX7zYsmmVP5EsXXxHh.jpg", // Forrest Gump
    "/saHP97rTPS5eLmrLQEcANmKrsFl.jpg", // The Godfather Part II
    "/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg", // The Green Mile
    "/5KCVkau1HEl7ZzfPsKAPM0sMiKc.jpg", // Léon: The Professional
    "/velWPhVMQeQKcxggNEU8YmIo52R.jpg", // The Lion King
  ],
  // 第6列
  [
    "/fIE3lAGcZDV1G6XM5KmuWnNsPp1.jpg", // Pulp Fiction
    "/bXNvzjULc9jrOVhGfjcc64uKZmZ.jpg", // The Usual Suspects
    "/1QpO9wo7JWecZ4NiBuu625FiY1j.jpg", // Spirited Away
    "/ygGmAO60t8GyqUo9xYeYxSZAR3b.jpg", // American Beauty
    "/Ab8mkHmkYADjU7wQiOkia9BzGvS.jpg", // Good Will Hunting
  ],
]

// 定义滚动动画的CSS
const scrollingStyles = `
  @keyframes scrollDown {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
  }
  
  @keyframes scrollUp {
    0% { transform: translateY(-50%); }
    100% { transform: translateY(0); }
  }
  
  .scroll-down {
    animation: scrollDown linear infinite;
  }
  
  .scroll-up {
    animation: scrollUp linear infinite;
  }
`

export default function SimpleScrollingBackground() {
  const [isClient, setIsClient] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    setIsClient(true)
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 提供一个服务器渲染时的基本占位符
  if (!isClient) {
    return <div className="fixed inset-0 z-0 bg-gray-950"></div>
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-gray-950">
      {/* 内联样式确保动画定义可用 */}
      <style jsx>{scrollingStyles}</style>

      {/* 响应式网格：手机端2列，平板端4列，桌面端6列 */}
      <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4 p-2 md:p-4">
        {[0, 1, 2, 3, 4, 5].map((colIndex) => {
          // 在小屏幕上只显示前2-3列
          if ((colIndex >= 2 && windowWidth < 640) || (colIndex >= 4 && windowWidth < 768)) {
            return null
          }

          // 确定是奇数列还是偶数列 (0-indexed，所以0是第1列，是奇数列)
          const isOdd = colIndex % 2 === 0

          // 复制海报数组以实现无缝循环
          const posters = [...classicMoviePosters[colIndex], ...classicMoviePosters[colIndex]]

          return (
            <div key={colIndex} className="relative h-full overflow-hidden">
              <div
                className={isOdd ? "scroll-down" : "scroll-up"}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  // 增加动画持续时间，减慢滚动速度
                  animationDuration: `${80 + colIndex * 10}s`,
                }}
              >
                {posters.map((poster, index) => (
                  <div key={index} className="relative aspect-[2/3] mb-2 md:mb-4 rounded-lg overflow-hidden opacity-10">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${poster}`}
                      alt={`Movie poster ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* 添加一个半透明叠加层，确保前台内容可见 */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
    </div>
  )
}

