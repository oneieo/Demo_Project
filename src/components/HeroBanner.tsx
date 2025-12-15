import React from "react";
import { Movie, getImageUrl } from "../utils/tmdbApi";
import "../css/Home.css";

interface HeroBannerProps {
  movie: Movie;
  isWishlisted: boolean;
  onToggleWishlist: (movie: Movie) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  isWishlisted,
  onToggleWishlist,
}) => {
  return (
    <div className="hero-banner">
      <div
        className="hero-backdrop"
        style={{
          backgroundImage: `url(${getImageUrl(
            movie.backdrop_path,
            "original"
          )})`,
        }}
      >
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-overview">{movie.overview || "설명이 없습니다."}</p>

        <div className="hero-buttons">
          <button
            className="hero-btn play-btn"
            onClick={() => onToggleWishlist(movie)}
          >
            <i className="fas fa-play"></i> 재생
          </button>
          <button
            className="hero-btn info-btn"
            onClick={() => onToggleWishlist(movie)}
          >
            <i className={`fas ${isWishlisted ? "fa-check" : "fa-plus"}`}></i>
            {isWishlisted ? "내가 찜한 리스트" : "내가 찜한 리스트"}
          </button>
        </div>

        <div className="hero-meta">
          <span className="hero-rating">
            ⭐ {movie.vote_average.toFixed(1)}
          </span>
          <span className="hero-date">{movie.release_date?.slice(0, 4)}</span>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
