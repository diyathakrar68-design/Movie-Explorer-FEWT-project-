import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { searchOrDiscoverMovies, fetchGenres } from "../services/tmdb";

export default function Movies() {
  const [p] = useSearchParams();
  const [q, setQ] = useState(p.get("q") || "");
  const [g, setG] = useState("");
  const [s, setS] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      const results = await searchOrDiscoverMovies({
        query: q,
        genreId: g,
        sortBy: s,
      });
      if (active) {
        setMovieList(results);
        setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [q, g, s]);

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="text-white-50 small fw-bold">MOVIE LIBRARY</div>
          <h1>All Movies</h1>
          <p>
            Search, filter and sort live TMDB movies or explore our collection.
          </p>
          <div className="row g-2 mt-4">
            <div className="col-md-6">
              <input
                className="form-control form-control-lg"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search movies by title..."
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-select-lg"
                value={g}
                onChange={(e) => setG(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.length > 0
                  ? genres.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))
                  : [
                      "Action",
                      "Adventure",
                      "Drama",
                      "Sci-Fi",
                      "Fantasy",
                      "Crime",
                      "Thriller",
                      "Sport",
                    ].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-select-lg"
                value={s}
                onChange={(e) => setS(e.target.value)}
              >
                <option value="">Recommended</option>
                <option value="rating">Highest Rating</option>
                <option value="year">Newest First</option>
              </select>
            </div>
          </div>
          <div className="text-secondary small mt-3">
            {loading ? "Searching..." : `${movieList.length} movies found`}
          </div>
        </div>
      </section>

      <section className="section pt-3">
        <div className="container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : movieList.length ? (
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5 g-3 g-lg-4">
              {movieList.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h4>No results found</h4>
              <p>Try adjusting your search terms or genre filter.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
