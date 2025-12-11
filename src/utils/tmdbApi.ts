import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    language: "ko-KR",
  },
});

tmdbApi.interceptors.request.use(
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

tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("TMDB-Key");
      window.location.href = "/#/signin";
    }
    return Promise.reject(error);
  }
);

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

export const movieApi = {
  // 인기 영화
  getPopular: (page: number = 1) =>
    tmdbApi.get<MoviesResponse>("/movie/popular", { params: { page } }),

  // 최신 영화
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
  getMovieDetails: (movieId: number) => tmdbApi.get(`/movie/${movieId}`),
};

export default tmdbApi;
