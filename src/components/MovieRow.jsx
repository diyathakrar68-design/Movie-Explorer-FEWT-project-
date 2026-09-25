import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, eyebrow, movies = [], icon = "🔥" }) {
  const rowRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);

    if (maxScroll > 0) {
      const progress = (scrollLeft / maxScroll) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    handleScroll();
  }, [movies]);

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const { clientWidth } = rowRef.current;
    const scrollAmount =
      direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
    rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!movies.length) return null;

  return (
    <section className="section py-4">
      <div className="container position-relative">
        {/* Row Header */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="fs-3">{icon}</span>
            <div>
              {eyebrow && (
                <div
                  className="text-white-50 text-uppercase fw-bold"
                  style={{ fontSize: "0.72rem", letterSpacing: "0.05em" }}
                >
                  {eyebrow}
                </div>
              )}
              <h2 className="section-title text-white h3 fw-extrabold m-0">
                {title}
              </h2>
            </div>
          </div>
          <Link
            to="/movies"
            className="view-all text-decoration-none fw-semibold d-flex align-items-center gap-1"
          >
            View All <span className="arrow">›</span>
          </Link>
        </div>

        {/* Carousel Outer Container with Left/Right Arrows */}
        <div className="movie-carousel-wrapper position-relative">
          {/* Left Arrow Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="carousel-arrow-btn left-arrow"
              aria-label="Scroll Left"
            >
              ❮
            </button>
          )}

          {/* Scrollable Row */}
          <div
            ref={rowRef}
            onScroll={handleScroll}
            className="movie-carousel-row d-flex gap-3 overflow-x-auto py-2 px-1"
          >
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>

          {/* Right Arrow Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="carousel-arrow-btn right-arrow"
              aria-label="Scroll Right"
            >
              ❯
            </button>
          )}
        </div>

        {/* Bottom Progress Bar Track */}
        <div className="carousel-progress-track mt-3">
          <div
            className="carousel-progress-bar"
            style={{
              width: `${Math.max(15, Math.min(100, scrollProgress + 20))}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
