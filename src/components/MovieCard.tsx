import React from "react";
import { Movie, getImageUrl } from "../utils/tmdbApi";
import "../css/Home.css";

interface MovieCardProps {
  movie: Movie;
  isWishlisted: boolean;
  onToggleWishlist: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isWishlisted,
  onToggleWishlist,
}) => {
  return (
    <div
      className={`movie-card ${isWishlisted ? "wishlisted" : ""}`}
      onClick={() => onToggleWishlist(movie)}
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

export default MovieCard;
