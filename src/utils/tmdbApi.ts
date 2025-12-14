import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

// Axios 인스턴스 생성
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    language: "ko-KR",
  },
});

// 요청 인터셉터: API 키 자동 추가
tmdbApi.interceptors.request.use(
  (config: any) => {
    const apiKey = localStorage.getItem("TMDB-Key");
    if (apiKey) {
      config.params = {
        ...config.params,
        api_key: apiKey,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리
tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // API 키가 유효하지 않은 경우
      localStorage.removeItem("TMDB-Key");
      window.location.href = "/#/signin";
    }
    return Promise.reject(error);
  }
);

// 장르 타입 정의
export interface Genre {
  id: number;
  name: string;
}

// 영화 타입 정의
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  genres?: Genre[]; // 상세 정보에서 사용
  popularity?: number;
  vote_count?: number;
  adult?: boolean;
  original_language?: string;
  original_title?: string;
  video?: boolean;
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface GenresResponse {
  genres: Genre[];
}

// API 함수들
export const movieApi = {
  // 인기 영화
  getPopular: (page: number = 1) =>
    tmdbApi.get<MoviesResponse>("/movie/popular", { params: { page } }),

  // 최신 영화 (현재 상영작)
  getNowPlaying: (page: number = 1) =>
    tmdbApi.get<MoviesResponse>("/movie/now_playing", { params: { page } }),

  // 높은 평점 영화
  getTopRated: (page: number = 1) =>
    tmdbApi.get<MoviesResponse>("/movie/top_rated", { params: { page } }),

  // 개봉 예정 영화
  getUpcoming: (page: number = 1) =>
    tmdbApi.get<MoviesResponse>("/movie/upcoming", { params: { page } }),

  // 영화 검색
  searchMovies: (query: string, page: number = 1) =>
    tmdbApi.get<MoviesResponse>("/search/movie", { params: { query, page } }),

  // 영화 상세 정보
  getMovieDetails: (movieId: number) => tmdbApi.get<Movie>(`/movie/${movieId}`),

  // 장르 목록 가져오기 (filtering 페이지에서 사용)
  getGenres: () => tmdbApi.get<GenresResponse>("/genre/movie/list"),

  // 장르별 영화 검색 (filtering 페이지에서 사용)
  discoverMovies: (params: {
    page?: number;
    with_genres?: string; // 장르 ID (쉼표로 구분)
    sort_by?: string; // 정렬 기준 (예: popularity.desc, vote_average.desc)
    "vote_average.gte"?: number; // 최소 평점
    "vote_average.lte"?: number; // 최대 평점
    "release_date.gte"?: string; // 최소 개봉일
    "release_date.lte"?: string; // 최대 개봉일
    with_original_language?: string; // 언어 필터
  }) => tmdbApi.get<MoviesResponse>("/discover/movie", { params }),

  // 트렌딩 영화 (추가 API - 선택사항)
  getTrending: (timeWindow: "day" | "week" = "week", page: number = 1) =>
    tmdbApi.get<MoviesResponse>(`/trending/movie/${timeWindow}`, {
      params: { page },
    }),
};

// 이미지 URL 생성 헬퍼 함수
export const getImageUrl = (
  path: string | null,
  size: "w200" | "w300" | "w500" | "w780" | "original" = "w500"
): string => {
  if (!path) return "/placeholder-movie.png"; // placeholder 이미지 경로
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// 장르 ID를 이름으로 변환하는 헬퍼 함수
export const genreMap: { [key: number]: string } = {
  28: "액션",
  12: "모험",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐멘터리",
  18: "드라마",
  10751: "가족",
  14: "판타지",
  36: "역사",
  27: "공포",
  10402: "음악",
  9648: "미스터리",
  10749: "로맨스",
  878: "SF",
  10770: "TV 영화",
  53: "스릴러",
  10752: "전쟁",
  37: "서부",
};

export const getGenreNames = (genreIds: number[]): string[] => {
  return genreIds.map((id) => genreMap[id] || "기타");
};

export default tmdbApi;
