import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { movieApi, Movie } from "../utils/tmdbApi";
import HeroBanner from "../components/HeroBanner";
import MovieSection from "../components/MovieSection";
import "../css/Home.css";

const Home = () => {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedWishlist = localStorage.getItem("movieWishlist");
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        setWishlist(parsed.map((movie: Movie) => movie.id));
      } catch (err) {
        console.error("Failed to parse wishlist:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const apiKey = localStorage.getItem("TMDB-Key");
      if (!apiKey) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);

        const [popular, nowPlaying, topRated, upcoming] = await Promise.all([
          movieApi.getPopular(1),
          movieApi.getNowPlaying(1),
          movieApi.getTopRated(1),
          movieApi.getUpcoming(1),
        ]);

        const popularResults = popular.data.results;

        setHeroMovie(popularResults[0]);
        setPopularMovies(popularResults.slice(1, 11));
        setNowPlayingMovies(nowPlaying.data.results.slice(0, 10));
        setTopRatedMovies(topRated.data.results.slice(0, 10));
        setUpcomingMovies(upcoming.data.results.slice(0, 10));

        setError("");
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.status_message ||
          "영화 데이터를 불러오는데 실패했습니다.";
        setError(errorMsg);
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [navigate]);

  const toggleWishlist = (movie: Movie) => {
    const savedWishlist = localStorage.getItem("movieWishlist");
    let currentWishlist: Movie[] = [];

    if (savedWishlist) {
      try {
        currentWishlist = JSON.parse(savedWishlist);
      } catch (err) {
        console.error("Failed to parse wishlist:", err);
      }
    }

    const existingIndex = currentWishlist.findIndex((m) => m.id === movie.id);

    if (existingIndex === -1) {
      currentWishlist.push(movie);
      setWishlist([...wishlist, movie.id]);
    } else {
      currentWishlist.splice(existingIndex, 1);
      setWishlist(wishlist.filter((id) => id !== movie.id));
    }

    localStorage.setItem("movieWishlist", JSON.stringify(currentWishlist));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h3>영화 불러오는 중...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>오류 발생</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/signin")} className="error-button">
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="home-container">
      {heroMovie && (
        <HeroBanner
          movie={heroMovie}
          isWishlisted={wishlist.includes(heroMovie.id)}
          onToggleWishlist={toggleWishlist}
        />
      )}

      <div className="movies-container">
        <MovieSection
          title="🔥 인기 영화"
          movies={popularMovies}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
        />
        <MovieSection
          title="🎬 현재 상영작"
          movies={nowPlayingMovies}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
        />
        <MovieSection
          title="⭐ 평점 높은 영화"
          movies={topRatedMovies}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
        />
        <MovieSection
          title="🎯 개봉 예정"
          movies={upcomingMovies}
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
        />
      </div>
    </div>
  );
};

export default Home;
