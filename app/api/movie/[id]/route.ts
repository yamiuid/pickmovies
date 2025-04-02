import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const movieId = params.id
  const apiKey = process.env.TMDB_API_KEY

  try {
    // 获取电影详情
    const movieResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`)
    const movieData = await movieResponse.json()

    // 获取演职员信息
    const creditsResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`,
    )
    const creditsData = await creditsResponse.json()

    // 获取电影图片
    const imagesResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`)
    const imagesData = await imagesResponse.json()

    // 组合数据
    const movieDetails = {
      ...movieData,
      credits: creditsData,
      images: imagesData,
    }

    return NextResponse.json(movieDetails)
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}

