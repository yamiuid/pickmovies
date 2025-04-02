"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import MovieCard from "./MovieCard"
import MovieDetail from "./MovieDetail"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
  release_date: string
}

// 骨架屏组件
const MovieCardSkeleton = () => (
  <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg overflow-hidden shadow-lg">
    <div className="relative aspect-[2/3] bg-gray-700 animate-pulse"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-700 rounded animate-pulse mb-2"></div>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded animate-pulse w-2/3"></div>
    </div>
  </div>
)

export default function MovieRecommendation() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recommendedMovieIds, setRecommendedMovieIds] = useState<number[]>([])
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // 组件挂载检查
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  // 当有电影显示时，通知背景组件增加暗度
  useEffect(() => {
    if (!isMounted) return;
    
    // 创建一个自定义事件，通知背景组件电影状态变化
    const event = new CustomEvent("moviesDisplayed", {
      detail: { hasMovies: movies.length > 0 || isLoading },
    })
    window.dispatchEvent(event)
  }, [movies, isMounted, isLoading])

  const getRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ excludeIds: recommendedMovieIds }),
      })
      const data = await response.json()
      setMovies(data)

      // 更新已推荐的电影ID列表
      const newIds = data.map((movie: Movie) => movie.id)
      setRecommendedMovieIds((prev) => [...prev, ...newIds])
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    }
    setIsLoading(false)
  }

  const handleMovieClick = (id: number) => {
    setSelectedMovieId(id)
  }

  const handleCloseDetail = () => {
    setSelectedMovieId(null)
  }

  return (
    <div className="w-full">
      <div className="flex justify-center mb-8">
        <motion.button
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getRecommendations}
          disabled={isLoading}
        >
          {isLoading ? "Finding Movies..." : "Get Recommendations"}
        </motion.button>
      </div>

      {/* 骨架屏 */}
      {isLoading && (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {[1, 2, 3].map((index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </motion.div>
      )}

      {/* 电影卡片 */}
      <AnimatePresence>
        {!isLoading && movies.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={handleMovieClick} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 电影详情弹窗 */}
      {selectedMovieId && <MovieDetail movieId={selectedMovieId} onClose={handleCloseDetail} />}
    </div>
  )
}

