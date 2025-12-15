import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Movie, movieApi, Genre } from "../utils/tmdbApi";
import MovieCard from "../components/MovieCard";
import "../css/Search.css";

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 필터 상태
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity.desc");
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // 위시리스트 상태 (id 배열)
  const [wishlist, setWishlist] = useState<number[]>([]);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 검색 키워드 확인
  useEffect(() => {
    const keyword = localStorage.getItem("searchKeyword");
    if (keyword) {
      setSearchKeyword(keyword);
      // 검색 키워드가 있으면 다른 필터 초기화
      setSelectedGenre("");
      setSelectedRating("");
      setSelectedLanguage("");
    }
  }, []);

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

  // 장르 목록 가져오기
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await movieApi.getGenres();
        setGenres(response.data.genres);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };
    fetchGenres();
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

        let response;

        if (searchKeyword.trim()) {
          response = await movieApi.searchMovies(searchKeyword, currentPage);
        } else {
          const params: any = {
            page: currentPage,
            sort_by: sortBy,
          };

          if (selectedGenre) {
            params.with_genres = selectedGenre;
          }

          if (selectedRating) {
            const [min, max] = selectedRating.split("-").map(Number);
            params["vote_average.gte"] = min;
            params["vote_average.lte"] = max;
          }

          if (selectedLanguage) {
            params.with_original_language = selectedLanguage;
          }

          response = await movieApi.discoverMovies(params);
        }

        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 500));
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
  }, [
    navigate,
    currentPage,
    selectedGenre,
    selectedRating,
    selectedLanguage,
    sortBy,
    searchKeyword,
  ]);

  const handleToggleWishlist = (movie: Movie) => {
    // movieWishlist (전체 Movie 객체 배열) 로드
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

  const handleResetFilters = () => {
    setSelectedGenre("");
    setSelectedRating("");
    setSelectedLanguage("");
    setSortBy("popularity.desc");
    setSearchKeyword("");
    setCurrentPage(1);
    localStorage.removeItem("searchKeyword");
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    localStorage.removeItem("searchKeyword");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="filtering-page">
      <div className="filtering-header">
        <h1>
          {searchKeyword
            ? `"${searchKeyword}" 검색 결과`
            : "선호하는 설정을 선택하세요"}
        </h1>
        {searchKeyword && (
          <button className="clear-search-btn" onClick={handleClearSearch}>
            검색 지우기
          </button>
        )}
      </div>

      {!searchKeyword && (
        <div className="filtering-controls">
          <div className="filter-group">
            <label>장르</label>
            <select
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">전체</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>평점</label>
            <select
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">전체</option>
              <option value="9-10">9~10점</option>
              <option value="8-9">8~9점</option>
              <option value="7-8">7~8점</option>
              <option value="6-7">6~7점</option>
              <option value="5-6">5~6점</option>
              <option value="4-5">4~5점</option>
              <option value="0-4">4점 이하</option>
            </select>
          </div>

          <div className="filter-group">
            <label>언어</label>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">전체</option>
              <option value="en">영어</option>
              <option value="ko">한국어</option>
              <option value="ja">일본어</option>
              <option value="zh">중국어</option>
              <option value="es">스페인어</option>
              <option value="fr">프랑스어</option>
            </select>
          </div>

          <div className="filter-group">
            <label>정렬</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="popularity.desc">인기순</option>
              <option value="vote_average.desc">평점 높은순</option>
              <option value="vote_average.asc">평점 낮은순</option>
              <option value="release_date.desc">최신순</option>
              <option value="release_date.asc">오래된순</option>
              <option value="title.asc">제목순 (A-Z)</option>
              <option value="revenue.desc">수익순</option>
            </select>
          </div>

          <button className="reset-button" onClick={handleResetFilters}>
            초기화
          </button>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>영화를 불러오는 중...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {!loading && movies.length === 0 && !error && (
        <div className="no-results">
          <p>
            {searchKeyword
              ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.`
              : "검색 결과가 없습니다."}
          </p>
          <button onClick={handleResetFilters}>
            {searchKeyword ? "다른 검색어로 시도" : "필터 초기화"}
          </button>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <>
          <div className="results-info">
            <p>
              총 <strong>{movies.length}</strong>개의 영화를 찾았습니다
            </p>
          </div>

          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isWishlisted={wishlist.includes(movie.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <>
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  «
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  ‹
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = idx + 1;
                  } else if (currentPage <= 3) {
                    pageNum = idx + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + idx;
                  } else {
                    pageNum = currentPage - 2 + idx;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`page-btn ${
                        currentPage === pageNum ? "active" : ""
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  ›
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  »
                </button>
              </div>

              <div className="page-info">
                Page {currentPage} of {totalPages}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
