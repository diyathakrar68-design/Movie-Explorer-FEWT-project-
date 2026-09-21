import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import { getMovieDetails } from '../services/tmdb';

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

  const saved = watchlist.some((item) => (typeof item === 'object' ? item.id === movie.id : item === movie.id));
  const posterSrc = movie.poster
    ? movie.poster
    : movie.id <= 15
    ? `/posters/${movie.id}.svg`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

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
                  e.target.src = 'https://via.placeholder.com/500x750?text=Poster+Unavailable';
                }}
              />
            </div>
          </div>
          <div className="col-md-8 col-lg-9 details">
            <div className="text-uppercase text-secondary small fw-bold">Movie Details</div>
            <h1>{movie.title}</h1>
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge badge-soft rounded-pill p-2">{movie.year}</span>
              <span className="badge badge-soft rounded-pill p-2">{movie.genre}</span>
              <span className="badge badge-soft rounded-pill p-2">★ {movie.rating}</span>
              <span className="badge badge-soft rounded-pill p-2">{movie.duration}</span>
            </div>
            <p className="lead text-secondary">{movie.desc}</p>
            <div className="d-flex gap-2 flex-wrap mb-4">
              <button
                className={`btn ${saved ? 'btn-danger' : 'btn-gradient'}`}
                onClick={() => toggleWatchlist(movie)}
              >
                {saved ? '♥ Remove from Watchlist' : '♡ Add to Watchlist'}
              </button>
              <Link className="btn btn-outline-light" to="/movies">
                ← All Movies
              </Link>
            </div>
          </div>
        </div>

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