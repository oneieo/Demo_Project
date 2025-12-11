import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

// Axios 인스턴스 생성
const getMovies = axios.create({
  baseURL: BASE_URL,
  params: {
    language: "ko-KR",
  },
});

// 요청 인터셉터: API 키 자동 추가
getMovies.interceptors.request.use(
  (config) => {
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
getMovies.interceptors.response.use(
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
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// API 함수들
export const movieApi = {
  // 인기 영화
  getPopular: (page: number = 1) =>
    getMovies.get<MoviesResponse>("/movie/popular", { params: { page } }),

  // 최신 영화
  getNowPlaying: (page: number = 1) =>
    getMovies.get<MoviesResponse>("/movie/now_playing", { params: { page } }),

  // 높은 평점 영화
  getTopRated: (page: number = 1) =>
    getMovies.get<MoviesResponse>("/movie/top_rated", { params: { page } }),

  // 개봉 예정 영화
  getUpcoming: (page: number = 1) =>
    getMovies.get<MoviesResponse>("/movie/upcoming", { params: { page } }),

  // 영화 검색
  searchMovies: (query: string, page: number = 1) =>
    getMovies.get<MoviesResponse>("/search/movie", { params: { query, page } }),

  // 영화 상세 정보
  getMovieDetails: (movieId: number) => getMovies.get(`/movie/${movieId}`),
};

export default getMovies;
