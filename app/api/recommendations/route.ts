import { type NextRequest, NextResponse } from "next/server"

// 添加此行以支持静态导出
export const dynamic = "force-static";

// 添加这个函数以指定静态生成的API路由路径
export function generateStaticParams() {
  return [];  // 这个API路由在静态导出时不会被包含
}

export async function POST(request: NextRequest) {
  const { excludeIds = [] } = await request.json()
  const apiKey = process.env.TMDB_API_KEY

  // 获取多页数据以确保有足够的电影可供选择
  try {
    // 首先尝试获取第一页
    const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`)
    const data = await response.json()
    let allMovies = [...data.results]

    // 如果已排除的电影数量较多，获取更多页面
    if (excludeIds.length > 10) {
      const page2Response = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=2`,
      )
      const page2Data = await page2Response.json()
      allMovies = [...allMovies, ...page2Data.results]
    }

    // 过滤掉已经推荐过的电影
    const filteredMovies = allMovies.filter((movie: any) => !excludeIds.includes(movie.id))

    // 从过滤后的电影中随机选择3部
    const randomMovies = getRandomMovies(filteredMovies, 3)
    return NextResponse.json(randomMovies)
  } catch (error) {
    console.error("Error fetching movie recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}

function getRandomMovies(movies: any[], count: number) {
  const shuffled = [...movies].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// 保留GET方法以向后兼容
export async function GET() {
  const apiKey = process.env.TMDB_API_KEY
  const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`

  try {
    const response = await fetch(url)
    const data = await response.json()
    const randomMovies = getRandomMovies(data.results, 3)
    return NextResponse.json(randomMovies)
  } catch (error) {
    console.error("Error fetching movie recommendations:", error)
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 })
  }
}

