import { movies as staticMovies } from '../data/movies';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';

export default function Watchlist() {
  const { watchlist } = useApp();

  const savedList = watchlist
    .map((item) => {
      if (typeof item === 'object' && item !== null) {
        return item;
      }
      return staticMovies.find((m) => m.id === Number(item));
    })
    .filter(Boolean);

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <div className="text-white-50 small fw-bold">PERSONAL COLLECTION</div>
          <h1>My Watchlist</h1>
          <p>Saved movies are stored in your browser using LocalStorage.</p>
        </div>
      </section>

      <section className="section pt-3">
        <div className="container">
          {savedList.length ? (
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5 g-3 g-lg-4">
              {savedList.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h4>Your watchlist is empty</h4>
              <p>Add movies from Home or All Movies to build your collection.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}