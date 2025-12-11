import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { movieApi, Movie } from "../utils/tmdbApi";

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      // API 키 확인
      const apiKey = localStorage.getItem("TMDB-Key");
      if (!apiKey) {
        navigate("/signin");
        return;
      }

      try {
        setLoading(true);
        
        // Axios로 인기 영화 가져오기
        const response = await movieApi.getPopular(1);
        setMovies(response.data.results);
        setError("");
      } catch (err: any) {
        const errorMsg = err.response?.data?.status_message || 
                        "영화 데이터를 불러오는데 실패했습니다.";
        setError(errorMsg);
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>로딩 중...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h2>오류 발생</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/signin")}>로그인 페이지로 이동</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#141414", minHeight: "100vh" }}>
      <h1 style={{ color: "white", marginBottom: "30px" }}>인기 영화</h1>
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{
              backgroundColor: "#2a2a2a",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ width: "100%", display: "block" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "300px",
                  backgroundColor: "#444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#999",
                }}
              >
                No Image
              </div>
            )}
            
            <div style={{ padding: "15px" }}>
              <h3 style={{ color: "white", fontSize: "16px", marginBottom: "10px" }}>
                {movie.title}
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "#46d369" }}>⭐ {movie.vote_average.toFixed(1)}</span>
                <span style={{ color: "#999" }}>{movie.release_date?.slice(0, 4)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;