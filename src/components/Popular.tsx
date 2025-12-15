import React, { useState, useEffect, useRef } from "react";
import { Movie, getImageUrl, movieApi } from "../utils/tmdbApi";
import "../css/Popular.css";

const Popular: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "infinite">("table");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchMovies = async (page: number, append: boolean = false) => {
    setLoading(true);
    try {
      const response = await movieApi.getPopular(page);
      const data = response.data;

      if (append) {
        setMovies((prev) => [...prev, ...data.results]);
      } else {
        setMovies(data.results);
      }
      setTotalPages(100);
    } catch (error) {
      console.error("영화 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchMovies(1);
  }, []);

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
    setCurrentPage(1);
    setMovies([]);
    fetchMovies(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode !== "infinite") return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      setShowScrollTop(scrollTop > 500);

      if (scrollPercentage > 0.9 && !loading && currentPage < totalPages) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchMovies(nextPage, true);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [viewMode, loading, currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMovies(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i>
          이전
        </button>

        <div className="pagination-numbers">
          {startPage > 1 && (
            <>
              <button
                className="pagination-number"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="pagination-ellipsis">...</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`pagination-number ${
                page === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="pagination-ellipsis">...</span>
              )}
              <button
                className="pagination-number"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };

  return (
    <div className="popular-page">
      <div className="popular-header">
        <div className="header-content">
          <h1 className="popular-title">오늘 전세계 인기 콘텐츠</h1>
          <p className="popular-subtitle">
            기다림이 아깝지 않은 컨텐츠를 만나보세요
          </p>
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <i className="fas fa-th"></i>
          </button>
          <button
            className={`toggle-btn ${viewMode === "infinite" ? "active" : ""}`}
            onClick={() => setViewMode("infinite")}
          >
            <i className="fas fa-scroll"></i>
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className={`movie-container ${
          viewMode === "infinite" ? "scrollable" : "fixed"
        }`}
      >
        <div className="movie-grid-popular">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`popular-movie-card ${
                wishlist.includes(movie.id) ? "wishlisted" : ""
              }`}
              onClick={() => setWishlist(movie)}
            >
              {movie.poster_path ? (
                <img
                  src={getImageUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                  className="popular-poster"
                />
              ) : (
                <div className="no-image">
                  <i className="fas fa-film"></i>
                </div>
              )}

              {wishlist.includes(movie.id) && (
                <div className="wishlist-badge">
                  <i className="fas fa-heart"></i>
                </div>
              )}

              <div className="popular-movie-info">
                <h3 className="popular-movie-title">{movie.title}</h3>
                <div className="popular-movie-meta">
                  <span className="rating">
                    <i className="fas fa-star"></i>
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span className="release-date">
                    {movie.release_date?.slice(0, 4)}
                  </span>
                </div>
              </div>

              <div className="hover-overlay">
                <button className="wishlist-btn">
                  <i
                    className={`${
                      wishlist.includes(movie.id) ? "fas" : "far"
                    } fa-heart`}
                  ></i>
                  {wishlist.includes(movie.id) ? "찜 해제" : "내가 찜한 콘텐츠"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>로딩 중...</p>
          </div>
        )}

        {viewMode === "infinite" && showScrollTop && (
          <button className="scroll-top-btn" onClick={scrollToTop}>
            <i className="fas fa-arrow-up"></i>
            TOP
          </button>
        )}
      </div>

      {viewMode === "table" && renderPagination()}
    </div>
  );
};

export default Popular;
