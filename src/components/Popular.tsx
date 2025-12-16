import React, { useState, useEffect, useRef } from "react";
import { Movie, getImageUrl, movieApi } from "../utils/tmdbApi";
import "../css/Popular.css";

const Popular: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "infinite">("table");
  const [allMovies, setAllMovies] = useState<Movie[]>([]); // 전체 영화 목록
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]); // 화면에 표시될 영화
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 6; // 테이블 뷰에서 페이지당 표시할 영화 수

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

  const toggleWishlist = (movie: Movie) => {
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
      currentMovieWishlist.push(movie);
      setWishlist([...wishlist, movie.id]);
    } else {
      currentMovieWishlist.splice(existingIndex, 1);
      setWishlist(wishlist.filter((id) => id !== movie.id));
    }

    localStorage.setItem("movieWishlist", JSON.stringify(currentMovieWishlist));
  };

  // 초기 영화 데이터 로드 (한 번에 많이 가져오기)
  const fetchAllMovies = async () => {
    setLoading(true);
    try {
      // 처음 5페이지의 영화를 한 번에 가져오기 (100개)
      const promises = [1, 2, 3, 4, 5].map((page) => movieApi.getPopular(page));
      const responses = await Promise.all(promises);

      const allMoviesData = responses.flatMap(
        (response) => response.data.results
      );
      setAllMovies(allMoviesData);

      // 총 페이지 수 계산 (6개씩)
      const calculatedTotalPages = Math.ceil(
        allMoviesData.length / ITEMS_PER_PAGE
      );
      setTotalPages(calculatedTotalPages);

      // 첫 페이지 표시
      setDisplayedMovies(allMoviesData.slice(0, ITEMS_PER_PAGE));
    } catch (error) {
      console.error("영화 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 무한 스크롤용 영화 로드
  const fetchMoviesForInfinite = async (
    page: number,
    append: boolean = false
  ) => {
    if (append) {
      setLoading(true); // append일 때만 로딩 표시
    }
    try {
      const response = await movieApi.getPopular(page);
      const data = response.data;

      if (append) {
        setDisplayedMovies((prev) => [...prev, ...data.results]);
      } else {
        setDisplayedMovies(data.results);
      }
    } catch (error) {
      console.error("영화 로드 실패:", error);
    } finally {
      if (append) {
        setLoading(false);
      }
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchAllMovies();
  }, []);

  // 뷰 모드 변경 시
  useEffect(() => {
    setCurrentPage(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    if (viewMode === "table") {
      // 테이블 뷰: 첫 6개만 표시
      setDisplayedMovies(allMovies.slice(0, ITEMS_PER_PAGE));
    } else {
      // 무한 스크롤: 첫 페이지 로드
      fetchMoviesForInfinite(1);
    }
  }, [viewMode]);

  // 무한 스크롤 처리
  useEffect(() => {
    if (viewMode !== "infinite") return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      setShowScrollTop(scrollTop > 500);

      if (scrollPercentage > 0.9 && !loading) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchMoviesForInfinite(nextPage, true);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [viewMode, loading, currentPage]);

  // 테이블 뷰 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedMovies(allMovies.slice(startIndex, endIndex));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pageNumbers: number[] = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

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
          {displayedMovies.map((movie) => (
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

        {loading && viewMode === "infinite" && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>더 많은 영화를 불러오는 중...</p>
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
