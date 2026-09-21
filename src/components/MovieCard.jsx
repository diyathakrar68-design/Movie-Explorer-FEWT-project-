import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function MovieCard({ movie }) {
  const { watchlist, toggleWatchlist } = useApp();
  const saved = watchlist.some((item) => (typeof item === 'object' ? item.id === movie.id : item === movie.id));

  const posterSrc = movie.poster
    ? movie.poster
    : movie.id <= 15
    ? `/posters/${movie.id}.svg`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div className="col">
      <div className="card movie-card h-100">
        <Link to={`/movie/${movie.id}`} className="card-img-wrap">
          <img
            src={posterSrc}
            alt={movie.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/500x750?text=Poster+Unavailable';
            }}
          />
          <span className="rating">★ {movie.rating}</span>
        </Link>
        <div className="card-body d-flex flex-column">
          <div className="meta mb-1">
            {movie.year} {movie.genre ? `• ${movie.genre}` : ''}
          </div>
          <h5 className="card-title mb-2 text-truncate" title={movie.title}>
            {movie.title}
          </h5>
          <p className="desc mb-3 flex-grow-1">{movie.desc}</p>
          <div className="d-flex gap-2 mt-auto">
            <Link className="btn btn-sm btn-gradient flex-grow-1" to={`/movie/${movie.id}`}>
              View Details
            </Link>
            <button
              className={`btn btn-sm ${saved ? 'btn-danger' : 'btn-outline-light'}`}
              onClick={() => toggleWatchlist(movie)}
              title={saved ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {saved ? '♥' : '♡'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}