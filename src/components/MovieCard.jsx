import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { movies as staticMovies } from "../data/movies";

export default function MovieCard({ movie }) {
  const { watchlist, toggleWatchlist } = useApp();
  const saved = watchlist.some((item) =>
    typeof item === "object" ? item.id === movie.id : item === movie.id,
  );

  const staticFound = staticMovies.find((m) => m.id === movie.id);

  const posterSrc =
    movie.poster && !movie.poster.includes(".svg")
      ? movie.poster
      : staticFound?.poster ||
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80";

  // Extract main primary genre name
  const primaryGenre = movie.genre ? movie.genre.split("/")[0].trim() : "Movie";

  return (
    <div className="movie-card-item">
      <div className={`card movie-card h-100 ${saved ? "is-saved" : ""}`}>
        <div className="card-img-wrap">
          {/* Top-Left Bookmark Button */}
          <button
            type="button"
            className={`bookmark-btn ${saved ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWatchlist(movie);
            }}
            title={saved ? "Remove from Watchlist" : "Save to Watchlist"}
            aria-label="Bookmark"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={saved ? "#fff" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>

          {/* Top-Right Star Rating Badge */}
          <span className="rating-badge">
            <span className="star">★</span> {movie.rating}
          </span>

          <Link to={`/movie/${movie.id}`} className="d-block w-100 h-100">
            <img
              src={posterSrc}
              alt={movie.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80";
              }}
            />
          </Link>
        </div>

        <Link
          to={`/movie/${movie.id}`}
          className="card-body text-decoration-none text-white d-flex flex-column p-3"
        >
          <h5
            className="card-title text-white mb-2 fw-bold text-truncate"
            title={movie.title}
          >
            {movie.title}
          </h5>
          <div className="d-flex align-items-center justify-content-between mt-auto meta-info">
            <span className="year-text">{movie.year}</span>
            <span className="genre-text">{primaryGenre}</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
