"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { X, Play, ExternalLink } from "lucide-react"
import { env } from "@/lib/env"

interface MovieDetailProps {
  movieId: number
  onClose: () => void
}

interface MovieDetails {
  id: number
  title: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  overview: string
  runtime: number
  genres: { id: number; name: string }[]
  credits: {
    cast: {
      id: number
      name: string
      character: string
      profile_path: string | null
    }[]
    crew: {
      id: number
      name: string
      job: string
      profile_path: string | null
    }[]
  }
  images: {
    backdrops: {
      file_path: string
      width: number
      height: number
    }[]
  }
}

// 电影详情骨架屏组件
const MovieDetailSkeleton = () => (
  <div className="relative">
    {/* 关闭按钮 */}
    <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-2 w-10 h-10"></div>

    {/* 电影海报和背景骨架 */}
    <div className="relative h-64 md:h-80 bg-gradient-to-b from-gray-700 to-gray-800 animate-pulse">
      <div className="absolute bottom-0 left-0 w-full p-6 flex items-end">
        {/* 海报骨架 */}
        <div className="hidden md:block w-36 h-52 relative mr-6 flex-shrink-0 bg-gray-700 rounded-md"></div>
        <div>
          {/* 标题骨架 */}
          <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
          {/* 信息骨架 */}
          <div className="flex flex-wrap items-center mt-2">
            <div className="h-4 bg-gray-700 rounded w-16 mr-4"></div>
            <div className="h-4 bg-gray-700 rounded w-20 mr-4"></div>
            <div className="h-4 bg-gray-700 rounded w-16 mr-4"></div>
          </div>
          <div className="flex flex-wrap mt-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-gray-700 rounded-full w-16 mr-2 mb-1"></div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* 观看入口骨架 */}
    <div className="bg-gray-900 p-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="h-10 bg-gray-700 rounded w-24"></div>
        <div className="h-10 bg-gray-700 rounded w-40"></div>
      </div>
    </div>

    {/* 内容骨架 */}
    <div className="p-6">
      {/* 概述骨架 */}
      <div className="mb-6">
        <div className="h-6 bg-gray-700 rounded w-32 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>

      {/* 演员骨架 */}
      <div className="mb-6">
        <div className="h-6 bg-gray-700 rounded w-40 mb-3"></div>
        <div className="h-4 bg-gray-700 rounded w-40 mb-3"></div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="text-center">
              <div className="w-full aspect-square bg-gray-700 rounded-md mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-1"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 剧照骨架 */}
      <div>
        <div className="h-6 bg-gray-700 rounded w-24 mb-3"></div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-video bg-gray-700 rounded-md"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// 流媒体平台列表
const streamingPlatforms = [
  {
    name: "Netflix",
    color: "bg-red-600",
    textColor: "text-white",
    searchUrl: (title: string) => `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
  },
  {
    name: "Prime Video",
    color: "bg-blue-700",
    textColor: "text-white",
    searchUrl: (title: string) => `https://www.amazon.com/s?k=${encodeURIComponent(title)}&i=instant-video`,
  },
  {
    name: "Disney+",
    color: "bg-blue-900",
    textColor: "text-white",
    searchUrl: (title: string) => `https://www.disneyplus.com/search?q=${encodeURIComponent(title)}`,
  },
  {
    name: "Max",
    color: "bg-purple-700",
    textColor: "text-white",
    searchUrl: (title: string) => `https://www.max.com/search?q=${encodeURIComponent(title)}`,
  },
  {
    name: "Hulu",
    color: "bg-green-600",
    textColor: "text-white",
    searchUrl: (title: string) => `https://www.hulu.com/search?q=${encodeURIComponent(title)}`,
  },
  {
    name: "Apple TV+",
    color: "bg-black",
    textColor: "text-white",
    searchUrl: (title: string) => `https://tv.apple.com/search?term=${encodeURIComponent(title)}`,
  },
]

// 电影详情缓存
const movieDetailsCache: Record<number, MovieDetails> = {};

export default function MovieDetail({ movieId, onClose }: MovieDetailProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true)
      setError(false)
      
      try {
        // 首先检查缓存中是否有此电影的详情
        if (movieDetailsCache[movieId]) {
          setMovie(movieDetailsCache[movieId])
          setLoading(false)
          return
        }
        
        // 尝试从预生成的API获取电影详情（在静态导出中，这可能不起作用）
        try {
          const response = await fetch(`/api/movie/${movieId}`)
          if (response.ok) {
            const data = await response.json()
            movieDetailsCache[movieId] = data
            setMovie(data)
            setLoading(false)
            return
          }
        } catch (err) {
          console.log("Static API route not accessible, falling back to direct API calls")
        }
        
        // 如果预生成的API不可访问，直接从TMDB API获取数据
        // 获取电影详情
        const movieResponse = await fetch(
          `${env.TMDB_API_URL}/movie/${movieId}?api_key=${env.TMDB_API_KEY}&language=en-US`
        )
        const movieData = await movieResponse.json()

        // 获取演职员信息
        const creditsResponse = await fetch(
          `${env.TMDB_API_URL}/movie/${movieId}/credits?api_key=${env.TMDB_API_KEY}&language=en-US`
        )
        const creditsData = await creditsResponse.json()

        // 获取电影图片
        const imagesResponse = await fetch(
          `${env.TMDB_API_URL}/movie/${movieId}/images?api_key=${env.TMDB_API_KEY}`
        )
        const imagesData = await imagesResponse.json()

        // 组合数据
        const movieDetails = {
          ...movieData,
          credits: creditsData,
          images: imagesData,
        }
        
        // 保存到缓存
        movieDetailsCache[movieId] = movieDetails
        setMovie(movieDetails)
      } catch (error) {
        console.error("Error fetching movie details:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (isMounted) {
      fetchMovieDetails()
    }
  }, [movieId, isMounted])

  // 获取导演信息
  const director = movie?.credits?.crew.find((person) => person.job === "Director")

  // 获取主要演员（最多5个）
  const mainCast = movie?.credits?.cast.slice(0, 5) || []

  // 获取剧照（最多4张）
  const backdrops = movie?.images?.backdrops.slice(0, 4) || []

  // 处理点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // 构建IMDB链接
  const imdbUrl = movie?.id ? `https://www.imdb.com/title/tt${movie.id.toString().padStart(7, "0")}` : "#"

  // 构建Google搜索链接
  const googleSearchUrl = movie?.title
    ? `https://www.google.com/search?q=watch+${encodeURIComponent(movie.title)}+movie+online`
    : "#"

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {loading ? (
            <MovieDetailSkeleton />
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-400 mb-4">Failed to load movie details.</p>
              <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          ) : movie ? (
            <div className="relative">
              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* 电影海报和背景 */}
              <div className="relative h-64 md:h-80 bg-gradient-to-b from-transparent to-gray-800">
                {movie.backdrop_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover opacity-50"
                  />
                )}
                <div className="absolute bottom-0 left-0 w-full p-6 flex items-end">
                  <div className="hidden md:block w-36 h-52 relative mr-6 flex-shrink-0">
                    {movie.poster_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        fill
                        className="object-cover rounded-md shadow-lg"
                      />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{movie.title}</h2>
                    <div className="flex flex-wrap items-center mt-2 text-sm text-gray-300">
                      <span className="mr-4">{new Date(movie.release_date).getFullYear()}</span>
                      <span className="mr-4 flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span className="mr-4">{movie.runtime} min</span>
                      <div className="flex flex-wrap mt-1">
                        {movie.genres.map((genre) => (
                          <span key={genre.id} className="mr-2 mb-1 px-2 py-1 bg-gray-700 rounded-full text-xs">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 观看入口 */}
              <div className="bg-gray-900 p-4">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={imdbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-black font-bold rounded-md hover:bg-yellow-400 transition-colors"
                  >
                    <span>IMDb</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={googleSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-500 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    <span>Find where to watch</span>
                  </a>
                </div>
              </div>

              {/* 电影详情内容 */}
              <div className="p-6">
                {/* 概述 */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Overview</h3>
                  <p className="text-gray-300">{movie.overview}</p>
                </div>

                {/* 导演和演员 */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Cast & Crew</h3>
                  {director && (
                    <div className="mb-2">
                      <span className="font-medium">Director: </span>
                      <span className="text-gray-300">{director.name}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Cast: </span>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-4">
                      {mainCast.map((actor) => (
                        <div key={actor.id} className="text-center">
                          <div className="w-full aspect-square relative mb-2 bg-gray-700 rounded-md overflow-hidden">
                            {actor.profile_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                alt={actor.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-4xl">👤</span>
                              </div>
                            )}
                          </div>
                          <p className="font-medium text-sm truncate">{actor.name}</p>
                          <p className="text-gray-400 text-xs truncate">{actor.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 剧照 */}
                {backdrops.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Images</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {backdrops.map((image, index) => (
                        <div key={index} className="relative aspect-video bg-gray-700 rounded-md overflow-hidden">
                          <Image
                            src={`https://image.tmdb.org/t/p/w780${image.file_path}`}
                            alt={`${movie.title} screenshot ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 流媒体平台 */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-3">Watch on Streaming Platforms</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {streamingPlatforms.map((platform) => (
                      <a
                        key={platform.name}
                        href={platform.searchUrl(movie.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${platform.color} ${platform.textColor} py-2 px-4 rounded-md text-center font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                      >
                        <span>{platform.name}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p>Failed to load movie details.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

