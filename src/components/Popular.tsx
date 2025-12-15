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

  // 위시리스트 불러오기 (movieWishlist에서 id만 추출)
  useEffect(() => {
    const savedMovieWishlist = localStorage.getItem("movieWishlist");
    if (savedMovieWishlist) {
      try {
        const parsed = JSON.parse(savedMovieWishlist);
        setWishlist(parsed.map((movie: Movie) => movie.id));
      } catch (err) {
        console.error("위시리스트 로드 실패:", err);
      }
    }
  }, []);

  // 위시리스트 토글
  const toggleWishlist = (movie: Movie) => {
    // movieWishlist (전체 Movie 객체 배열) 관리
    const savedMovieWishlist = localStorage.getItem("movieWishlist");
    let currentMovieWishlist: Movie[] = [];

    if (savedMovieWishlist) {
      try {
        currentMovieWishlist = JSON.parse(savedMovieWishlist);
      } catch (err) {
        console.error("위시리스트 파싱 실패:", err);
      }
    }

    const existingIndex = currentMovieWishlist.findIndex(
      (m) => m.id === movie.id
    );

    if (existingIndex === -1) {
      // 추가
      currentMovieWishlist.push(movie);
      setWishlist([...wishlist, movie.id]);
    } else {
      // 제거
      currentMovieWishlist.splice(existingIndex, 1);
      setWishlist(wishlist.filter((id) => id !== movie.id));
    }

    // movieWishlist만 저장
    localStorage.setItem("movieWishlist", JSON.stringify(currentMovieWishlist));
  };

  // 영화 데이터 로드
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
      setTotalPages(Math.min(data.total_pages, 100)); // 최대 100페이지
    } catch (error) {
      console.error("영화 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchMovies(1);
  }, []);

  // View 모드 변경 시 초기화
  useEffect(() => {
    setCurrentPage(1);
    setMovies([]);
    fetchMovies(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [viewMode]);

  // 무한 스크롤 감지
  useEffect(() => {
    if (viewMode !== "infinite") return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // 스크롤 탑 버튼 표시
      setShowScrollTop(scrollTop > 500);

      // 90% 스크롤 시 다음 페이지 로드
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

  // 페이지 변경 (테이블 모드)
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMovies(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 맨 위로 스크롤
  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 페이지네이션 렌더링
  const renderPagination = () => {
    const pageNumbers: number[] = [];
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
              onClick={() => toggleWishlist(movie)}
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
