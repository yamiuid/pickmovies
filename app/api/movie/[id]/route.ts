import { type NextRequest, NextResponse } from "next/server"
import { env } from "@/lib/env"

// 添加此行以支持静态导出
export const dynamic = "force-static";
export const dynamicParams = false; // 不允许运行时为未在generateStaticParams中定义的参数生成页面

// 添加这个函数以指定静态生成的API路由路径
export function generateStaticParams() {
  // 为一些热门电影ID预生成路径
  return [
    { id: "299534" },  // 复仇者联盟4：终局之战
    { id: "299536" },  // 复仇者联盟3：无限战争
    { id: "1726" },    // 钢铁侠
    { id: "157336" },  // 星际穿越
    { id: "550" },     // 搏击俱乐部
    { id: "155" },     // 黑暗骑士
    { id: "13" },      // 阿甘正传
    { id: "238" },     // 教父
    { id: "680" },     // 低俗小说
    { id: "429" },     // 肖申克的救赎
  ];
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const movieId = params.id
  const apiKey = env.TMDB_API_KEY

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

