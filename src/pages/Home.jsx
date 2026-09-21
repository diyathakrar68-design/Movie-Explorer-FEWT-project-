import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieRow from '../components/MovieRow';
import {
  getTrendingMovies,
  getTopRatedMovies,
  getPopularMovies,
} from '../services/tmdb';

export default function Home() {
  const [q, setQ] = useState('');
  const [latestMovies, setLatestMovies] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function loadAllMovies() {
      setLoading(true);
      const [latest, top, popular] = await Promise.all([
        getTrendingMovies(),
        getTopRatedMovies(),
        getPopularMovies(),
      ]);

      if (isMounted) {
        setLatestMovies(latest);
        setTopMovies(top);
        setPopularMovies(popular);
        setLoading(false);
      }
    }
    loadAllMovies();
    return () => {
      isMounted = false;
    };
  }, []);

  const go = (e) => {
    e.preventDefault();
    nav(q.trim() ? `/movies?q=${encodeURIComponent(q.trim())}` : '/movies');
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="col-lg-8">
            <div className="text-white-50 small fw-bold mb-3">MOVIE EXPLORER</div>
            <h1 className="hero-title">
              Discover your next <span className="gradient-text">favorite movie.</span>
            </h1>
            <p className="hero-copy mt-4">
              Browse latest releases, top rated films and popular movies dynamically powered by TMDB. Open any movie to see details and save it to your watchlist.
            </p>
            <form onSubmit={go} className="mt-4">
              <div className="input-group input-group-lg">
                <input
                  className="form-control"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search movies..."
                />
                <button className="btn btn-gradient px-4">Search</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading movies...</span>
          </div>
          <div className="text-white-50 mt-2 small">Loading movies from TMDB...</div>
        </div>
      ) : (
        <>
          <MovieRow title="Latest & Trending Movies" eyebrow="FRESH RELEASES" movies={latestMovies} />
          <MovieRow title="Top Rated Movies" eyebrow="CRITICS & AUDIENCES" movies={topMovies} />
          <MovieRow title="Popular Movies" eyebrow="FAN FAVORITES" movies={popularMovies} />
        </>
      )}
    </>
  );
}