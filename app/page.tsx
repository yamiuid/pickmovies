import MovieRecommendation from "@/components/MovieRecommendation"
import SimpleScrollingBackground from "@/components/SimpleScrollingBackground"

// 为静态导出指定生成的路径
export function generateStaticParams() {
  return [{ }]  // 只生成主页
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative">
      <SimpleScrollingBackground />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse text-center px-2">
          Pick Movies Now
        </h1>
        <MovieRecommendation />
      </div>
    </main>
  )
}

