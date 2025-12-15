import React, { useState, useEffect } from "react";
import { Movie } from "../utils/tmdbApi";
import MovieCard from "./MovieCard";
import "../css/Wishlist.css";

const Wishlist: React.FC = () => {
  const [wishlistMovies, setWishlistMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [sortBy, setSortBy] = useState<"date" | "rating" | "title">("date");
  const [searchQuery, setSearchQuery] = useState("");

  // localStorage에서 위시리스트 불러오기
  useEffect(() => {
    loadWishlist();
  }, []);

  // 정렬 및 검색 적용
  useEffect(() => {
    let filtered = [...wishlistMovies];

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "date":
      default:
        // 추가된 순서 유지 (역순)
        filtered.reverse();
        break;
    }

    setFilteredMovies(filtered);
  }, [wishlistMovies, sortBy, searchQuery]);

  const loadWishlist = () => {
    const savedWishlist = localStorage.getItem("movieWishlist");
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist);
        setWishlistMovies(parsed);
      } catch (err) {
        console.error("위시리스트 로드 실패:", err);
      }
    }
  };

  const toggleWishlist = (movie: Movie) => {
    const savedWishlist = localStorage.getItem("movieWishlist");
    let currentWishlist: Movie[] = [];

    if (savedWishlist) {
      try {
        currentWishlist = JSON.parse(savedWishlist);
      } catch (err) {
        console.error("위시리스트 파싱 실패:", err);
      }
    }

    const existingIndex = currentWishlist.findIndex((m) => m.id === movie.id);

    if (existingIndex !== -1) {
      currentWishlist.splice(existingIndex, 1);
      localStorage.setItem("movieWishlist", JSON.stringify(currentWishlist));
      setWishlistMovies(currentWishlist);
    }
  };

  const clearAllWishlist = () => {
    if (window.confirm("모든 찜 목록을 삭제하시겠습니까?")) {
      localStorage.removeItem("movieWishlist");
      setWishlistMovies([]);
    }
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div className="header-content">
          <h1 className="wishlist-title">내가 찜한 콘텐츠</h1>
          <p className="wishlist-subtitle">
            {wishlistMovies.length}개의 영화가 저장되어 있습니다
          </p>
        </div>

        {wishlistMovies.length > 0 && (
          <button className="clear-all-btn" onClick={clearAllWishlist}>
            <i className="fas fa-trash"></i>
            모두 삭제
          </button>
        )}
      </div>

      {wishlistMovies.length > 0 ? (
        <>
          <div className="wishlist-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="영화 제목 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-wishlist"
              />
              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <div className="sort-controls">
              <label>정렬:</label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "date" | "rating" | "title")
                }
                className="sort-select"
              >
                <option value="date">추가한 순서</option>
                <option value="rating">평점 높은 순</option>
                <option value="title">제목 순</option>
              </select>
            </div>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="wishlist-grid">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isWishlisted={true}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <h2>검색 결과가 없습니다</h2>
              <p>다른 키워드로 검색해보세요</p>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <i className="fas fa-heart-broken"></i>
          <h2>찜한 콘텐츠가 없습니다</h2>
          <p>마음에 드는 영화를 찜해보세요!</p>
          <a href="/#/" className="browse-btn">
            <i className="fas fa-film"></i>
            영화 둘러보기
          </a>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
