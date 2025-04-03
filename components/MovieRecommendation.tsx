"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import MovieCard from "./MovieCard"
import MovieDetail from "./MovieDetail"
import { env } from "@/lib/env"

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

// 从返回的电影列表中随机选择几个
function getRandomMovies(movies: any[], count: number) {
  const shuffled = [...movies].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// 缓存所有已获取的电影
let cachedMovies: Movie[] = [];

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
      // 只有当缓存为空时才从API获取电影
      if (cachedMovies.length === 0) {
        // 直接调用TMDB API - 获取更多电影（2页数据）以增加随机性
        const url1 = `${env.TMDB_API_URL}/movie/top_rated?api_key=${env.TMDB_API_KEY}&language=en-US&page=1`;
        const url2 = `${env.TMDB_API_URL}/movie/top_rated?api_key=${env.TMDB_API_KEY}&language=en-US&page=2`;
        
        const [response1, response2] = await Promise.all([
          fetch(url1),
          fetch(url2)
        ]);
        
        const data1 = await response1.json();
        const data2 = await response2.json();
        
        // 合并两页数据
        cachedMovies = [...data1.results, ...data2.results];
      }
      
      // 过滤已推荐的电影
      const filteredMovies = cachedMovies.filter((movie: Movie) => !recommendedMovieIds.includes(movie.id));
      
      // 如果过滤后电影数量不足，则重置已推荐列表
      if (filteredMovies.length < 3) {
        setRecommendedMovieIds([]);
        // 随机选择3部电影
        const randomMovies = getRandomMovies(cachedMovies, 3);
        setMovies(randomMovies);
        // 更新已推荐的电影ID列表
        const newIds = randomMovies.map((movie: Movie) => movie.id);
        setRecommendedMovieIds(newIds);
      } else {
        // 随机选择3部电影
        const randomMovies = getRandomMovies(filteredMovies, 3);
        setMovies(randomMovies);
        // 更新已推荐的电影ID列表
        const newIds = randomMovies.map((movie: Movie) => movie.id);
        setRecommendedMovieIds((prev) => [...prev, ...newIds]);
      }
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

