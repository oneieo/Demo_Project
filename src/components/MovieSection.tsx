import React from "react";
import { Movie } from "../utils/tmdbApi";
import MovieCard from "./MovieCard";
import "../css/Home.css";

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  wishlist: number[];
  onToggleWishlist: (movie: Movie) => void;
}

const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  wishlist,
  onToggleWishlist,
}) => {
  if (movies.length === 0) return null;

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
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isWishlisted={wishlist.includes(movie.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieSection;
