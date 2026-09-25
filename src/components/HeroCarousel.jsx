import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function HeroCarousel({
  movies = [],
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist } = useApp();

  const featuredMovies = movies.slice(0, 5);

  // Auto-play timer
  useEffect(() => {
    if (!featuredMovies.length || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredMovies.length, isHovered]);

  if (!featuredMovies.length) return null;

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];

  const inWatchlist = watchlist.some((item) =>
    typeof item === "object"
      ? item.id === currentMovie.id
      : item === currentMovie.id,
  );

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length,
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  // Determine background style (backdrop image or dark theme gradient fallback)
  const bgStyle = currentMovie.backdrop
    ? {
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 20%, rgba(15, 23, 42, 0.6) 60%, rgba(15, 23, 42, 0.85) 100%), url(${currentMovie.backdrop})`,
      }
    : {
        backgroundImage: `linear-gradient(135deg, #${currentMovie.color || "1e293b"} 0%, #0f172a 100%)`,
      };

  return (
    <section
      className="hero-carousel-section position-relative overflow-hidden mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Background Slides with smooth fade transitions */}
      <div className="hero-carousel-bg-wrapper">
        {featuredMovies.map((movie, idx) => {
          const active = idx === currentIndex;
          const slideBg = movie.backdrop
            ? {
                backgroundImage: `radial-gradient(circle at 70% 30%, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.95) 75%), url(${movie.backdrop})`,
              }
            : {
                backgroundImage: `linear-gradient(135deg, #${movie.color || "1e293b"} 0%, #0f172a 100%)`,
              };

          return (
            <div
              key={movie.id}
              className={`hero-slide-bg ${active ? "active" : ""}`}
              style={slideBg}
            />
          );
        })}
      </div>

      <div className="container position-relative py-5 z-2">
        <div className="row align-items-center min-vh-50 py-4">
          <div className="col-lg-7 text-white">
            {/* Tag / Eyebrow */}
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-gradient-primary text-uppercase px-3 py-2 fw-semibold">
                🔥 Featured Release
              </span>
              <span className="text-warning fw-bold">
                ★ {currentMovie.rating} / 10
              </span>
              <span className="text-white-50">|</span>
              <span className="text-white-50">{currentMovie.year}</span>
              <span className="text-white-50">|</span>
              <span className="badge bg-dark border border-secondary text-light">
                {currentMovie.genre}
              </span>
            </div>

            {/* Movie Title */}
            <h1 className="display-4 fw-extrabold hero-slide-title mb-3">
              {currentMovie.title}
            </h1>

            {/* Movie Description */}
            <p
              className="lead text-white-50 mb-4 line-clamp-3 hero-slide-desc"
              style={{ maxWidth: "650px" }}
            >
              {currentMovie.desc}
            </p>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => navigate(`/movie/${currentMovie.id}`)}
                className="btn btn-primary btn-lg px-4 rounded-pill shadow d-flex align-items-center gap-2 fw-semibold"
              >
                <span>▶ View Details</span>
              </button>

              <button
                onClick={() => toggleWatchlist(currentMovie)}
                className={`btn btn-lg px-4 rounded-pill d-flex align-items-center gap-2 fw-semibold transition-all ${
                  inWatchlist ? "btn-success" : "btn-outline-light"
                }`}
              >
                <span>
                  {inWatchlist ? "✓ Saved to Watchlist" : "+ Add to Watchlist"}
                </span>
              </button>
            </div>

            {/* Search Input Box integrated in Carousel */}
            <form onSubmit={onSearchSubmit} className="mt-4 me-lg-4">
              <div className="input-group input-group-lg shadow-lg rounded-pill overflow-hidden bg-dark border border-secondary">
                <span className="input-group-text bg-transparent border-0 text-white-50 ps-3">
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control bg-transparent border-0 text-white shadow-none"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search over thousands of movies..."
                />
                <button className="btn btn-gradient px-4 rounded-pill my-1 me-1 fw-bold">
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Featured Movie Poster Card Preview */}
          <div className="col-lg-5 d-none d-lg-flex justify-content-center">
            <div
              className="hero-poster-card shadow-2xl rounded-4 overflow-hidden position-relative cursor-pointer"
              onClick={() => navigate(`/movie/${currentMovie.id}`)}
            >
              <img
                src={
                  currentMovie.poster ||
                  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80"
                }
                alt={currentMovie.title}
                className="img-fluid hero-poster-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80";
                }}
              />
              <div className="hero-poster-overlay d-flex align-items-end p-4">
                <div>
                  <h5 className="text-white fw-bold mb-1">
                    {currentMovie.title}
                  </h5>
                  <div className="text-white-50 small">
                    Click to explore details & reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Controls (Arrows & Indicators) */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-25">
          {/* Indicators / Dots */}
          <div className="d-flex align-items-center gap-2">
            {featuredMovies.map((m, idx) => (
              <button
                key={m.id}
                type="button"
                className={`hero-carousel-dot ${idx === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
                title={m.title}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="d-flex gap-2">
            <button
              onClick={prevSlide}
              className="btn btn-outline-light rounded-circle p-2 hero-nav-btn"
              aria-label="Previous Slide"
            >
              ❮
            </button>
            <button
              onClick={nextSlide}
              className="btn btn-outline-light rounded-circle p-2 hero-nav-btn"
              aria-label="Next Slide"
            >
              ❯
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
