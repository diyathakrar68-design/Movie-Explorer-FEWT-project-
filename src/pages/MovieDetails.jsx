import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import MovieCard from "../components/MovieCard";
import { getMovieDetails } from "../services/tmdb";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const { watchlist, toggleWatchlist } = useApp();

  useEffect(() => {
    let active = true;
    setLoading(true);

    getMovieDetails(id).then((res) => {
      if (active) {
        setMovie(res.movie);
        setSimilar(res.similar || []);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading details...</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <h2>Movie not found</h2>
        <Link className="btn btn-gradient mt-3" to="/movies">
          Back to Movies
        </Link>
      </div>
    );
  }

  const saved = watchlist.some((item) =>
    typeof item === "object" ? item.id === movie.id : item === movie.id,
  );
  const posterSrc =
    movie.poster && !movie.poster.includes(".svg")
      ? movie.poster
      : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80";

  return (
    <section className="details-wrap">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-md-4 col-lg-3">
            <div className="details-poster">
              <img
                src={posterSrc}
                alt={movie.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80";
                }}
              />
            </div>
          </div>
          <div className="col-md-8 col-lg-9 details">
            <div className="text-uppercase text-secondary small fw-bold">
              Movie Details
            </div>
            <h1>{movie.title}</h1>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge badge-soft rounded-pill p-2">
                {movie.year}
              </span>
              <span className="badge badge-soft rounded-pill p-2">
                {movie.genre}
              </span>
              <span className="badge badge-soft rounded-pill p-2">
                ★ {movie.rating}
              </span>
              <span className="badge badge-soft rounded-pill p-2">
                {movie.duration}
              </span>
            </div>
            <p className="lead text-secondary">{movie.desc}</p>
            <div className="d-flex gap-2 flex-wrap mb-4">
              <button
                className={`btn ${saved ? "btn-danger" : "btn-gradient"}`}
                onClick={() => toggleWatchlist(movie)}
              >
                {saved ? "♥ Remove from Watchlist" : "♡ Add to Watchlist"}
              </button>
              <Link className="btn btn-outline-light" to="/">
                🏠 Home
              </Link>
              <Link className="btn btn-outline-light" to="/movies">
                ← All Movies
              </Link>
            </div>
          </div>
        </div>

        {/* Top Cast Section */}
        {movie.cast && movie.cast.length > 0 && (
          <>
            <hr className="border-secondary opacity-25 my-5" />
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="fw-bold m-0">Top Cast</h3>
              <span className="text-white-50 small">
                {movie.cast.length} Actors
              </span>
            </div>
            <div className="row row-cols-3 row-cols-sm-4 row-cols-md-6 row-cols-lg-8 g-3">
              {movie.cast.map((actor) => (
                <div key={actor.id || actor.name} className="col text-center">
                  <div
                    className="cast-avatar-wrap mx-auto mb-2 position-relative"
                    style={{ width: "75px", height: "75px" }}
                  >
                    <img
                      src={
                        actor.profilePath ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          actor.name,
                        )}&background=1e293b&color=fff&size=150`
                      }
                      alt={actor.name}
                      className="rounded-circle w-100 h-100 shadow-sm border border-2 border-secondary border-opacity-50"
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          actor.name,
                        )}&background=1e293b&color=fff&size=150`;
                      }}
                    />
                  </div>
                  <h6
                    className="text-white mb-0 fw-semibold text-truncate"
                    style={{ fontSize: "0.82rem" }}
                    title={actor.name}
                  >
                    {actor.name}
                  </h6>
                  <p
                    className="text-white-50 text-truncate m-0"
                    style={{ fontSize: "0.72rem" }}
                    title={actor.character}
                  >
                    {actor.character || "Actor"}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {similar.length > 0 && (
          <>
            <hr className="border-secondary opacity-25 my-5" />
            <h3 className="fw-bold mb-3">You may also like</h3>
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
              {similar.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
