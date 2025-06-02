"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface MovieProps {
  movie: {
    id: number
    title: string
    poster_path: string
    vote_average: number
    release_date: string
  }
  onClick: (id: number) => void
}

export default function MovieCard({ movie, onClick }: MovieProps) {
  return (
    <motion.div
      className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(movie.id)}
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
        <p className="text-sm text-gray-300">Rating: {movie.vote_average.toFixed(1)}</p>
        <p className="text-sm text-gray-300">Release: {new Date(movie.release_date).getFullYear()}</p>
      </div>
    </motion.div>
  )
}

