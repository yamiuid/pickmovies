// 安全地访问环境变量
export const env = {
  TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY || '',
  TMDB_API_URL: 'https://api.themoviedb.org/3',
}; 