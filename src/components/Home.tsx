import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { movieApi, Movie, getImageUrl } from "../utils/tmdbApi";
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

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const container = e.currentTarget;
    const cardWidth = 200;
    const gap = 10;
    const cardsToScroll = 5;
    const scrollDistance = (cardWidth + gap) * cardsToScroll;

    if (e.deltaY > 0) {
      container.scrollBy({ left: scrollDistance, behavior: "smooth" });
    } else {
      container.scrollBy({ left: -scrollDistance, behavior: "smooth" });
    }
  };

  const renderMovieCard = (movie: Movie) => {
    const isWishlisted = wishlist.includes(movie.id);

    return (
      <div
        key={movie.id}
        className={`movie-card ${isWishlisted ? "wishlisted" : ""}`}
        onClick={() => toggleWishlist(movie)}
      >
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path, "w500")}
            alt={movie.title}
            className="movie-poster"
          />
        ) : (
          <div className="no-image">No Image</div>
        )}

        {isWishlisted && (
          <div className="wishlist-badge">
            <i className="fas fa-heart"></i>
          </div>
        )}

        <div className="movie-info">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-overview">
            {movie.overview
              ? movie.overview.slice(0, 100) + "..."
              : "설명이 없습니다."}
          </p>
          <div className="movie-meta">
            <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
            <span className="release-date">
              {movie.release_date?.slice(0, 4)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderMovieSection = (title: string, movies: Movie[]) => {
    if (movies.length === 0) return null;

    return (
      <section className="movie-section">
        <h2 className="section-title">{title}</h2>
        <div
          className="movie-grid"
          onWheel={handleWheel}
          style={{ cursor: "grab" }}
          onMouseDown={(e) => (e.currentTarget.style.cursor = "grabbing")}
          onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
          onMouseLeave={(e) => (e.currentTarget.style.cursor = "grab")}
        >
          {movies.map(renderMovieCard)}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>영화 로딩 중...</h2>
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
        <div className="hero-banner">
          <div
            className="hero-backdrop"
            style={{
              backgroundImage: `url(${getImageUrl(
                heroMovie.backdrop_path,
                "original"
              )})`,
            }}
          >
            <div className="hero-overlay"></div>
          </div>

          <div className="hero-content">
            <h1 className="hero-title">{heroMovie.title}</h1>
            <p className="hero-overview">
              {heroMovie.overview || "설명이 없습니다."}
            </p>

            <div className="hero-buttons">
              <button
                className="hero-btn play-btn"
                onClick={() => toggleWishlist(heroMovie)}
              >
                <i className="fas fa-play"></i> 재생
              </button>
              <button
                className="hero-btn info-btn"
                onClick={() => toggleWishlist(heroMovie)}
              >
                <i
                  className={`fas ${
                    wishlist.includes(heroMovie.id) ? "fa-check" : "fa-plus"
                  }`}
                ></i>
                {wishlist.includes(heroMovie.id)
                  ? "내가 찜한 리스트"
                  : "내가 찜한 리스트"}
              </button>
            </div>

            <div className="hero-meta">
              <span className="hero-rating">
                ⭐ {heroMovie.vote_average.toFixed(1)}
              </span>
              <span className="hero-date">
                {heroMovie.release_date?.slice(0, 4)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="movies-container">
        {renderMovieSection("🔥 인기 영화", popularMovies)}
        {renderMovieSection("🎬 현재 상영작", nowPlayingMovies)}
        {renderMovieSection("⭐ 평점 높은 영화", topRatedMovies)}
        {renderMovieSection("🎯 개봉 예정", upcomingMovies)}
      </div>
    </div>
  );
};

export default Home;
