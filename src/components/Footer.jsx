import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer>
      <div className="container d-flex flex-column flex-md-row justify-content-between gap-3">
        <div>
          <strong className="text-white">🍃 MovieMint</strong>
          <div>Explore • Discover • Save</div>
        </div>
        <div className="d-flex gap-3">
          <Link to="/">Home</Link>
          <Link to="/movies">All Movies</Link>
          <Link to="/watchlist">Watchlist</Link>
        </div>
      </div>
    </footer>
  );
}
