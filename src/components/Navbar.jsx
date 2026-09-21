import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { watchlist, loggedIn, user, logout, apiKey, updateApiKey } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey || '');

  const handleSaveKey = (e) => {
    e.preventDefault();
    updateApiKey(keyInput.trim());
    setShowModal(false);
    window.location.reload(); // Refresh to fetch fresh TMDB data
  };

  return (
    <>
      <header className="site-header">
        <nav className="navbar navbar-expand-lg">
          <div className="container py-2">
            <Link className="navbar-brand brand text-white d-flex align-items-center gap-2" to="/">
              <span className="brand-icon">▶</span> Movie Explorer
            </Link>

            <div className="d-flex align-items-center gap-2 me-2">
              <button
                className={`btn btn-sm ${apiKey ? 'btn-outline-success' : 'btn-outline-warning'} rounded-pill text-nowrap`}
                onClick={() => setShowModal(true)}
                title="Configure TMDB API Key"
                style={{ fontSize: '0.78rem' }}
              >
                {apiKey ? '⚡ TMDB Active' : '⚙ TMDB Key'}
              </button>
            </div>

            <button
              className="navbar-toggler border-secondary"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#nav"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="nav">
              <div className="navbar-nav ms-auto align-items-lg-center">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
                <NavLink className="nav-link" to="/movies">
                  All Movies
                </NavLink>
                <NavLink className="nav-link" to="/watchlist">
                  Watchlist{' '}
                  {watchlist.length > 0 && (
                    <span className="badge bg-danger ms-1">{watchlist.length}</span>
                  )}
                </NavLink>

                {loggedIn ? (
                  <>
                    <span className="nav-link text-light">Hi, {user?.name || 'User'}</span>
                    <button className="btn btn-sm btn-outline-light ms-lg-2" onClick={logout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink className="nav-link" to="/login">
                      Login
                    </NavLink>
                    <NavLink className="nav-link" to="/signup">
                      Sign Up
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* TMDB API Key Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title">🎬 TMDB API Settings</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <form onSubmit={handleSaveKey}>
                <div className="modal-body">
                  <p className="text-secondary small">
                    Enter your <strong>The Movie Database (TMDB) API Key</strong> to fetch live trending, top rated, and popular movies with real cover posters!
                  </p>
                  <div className="mb-3">
                    <label className="form-label small text-uppercase text-white-50">
                      TMDB API Key (v3 auth)
                    </label>
                    <input
                      type="text"
                      className="form-control bg-secondary bg-opacity-25 text-white border-secondary"
                      placeholder="e.g. 8a3f..."
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                    />
                  </div>
                  <div className="alert alert-info py-2 small mb-0">
                    💡 If left empty or no key is provided, the app will gracefully fall back to the built-in local collection!
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  {apiKey && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm me-auto"
                      onClick={() => {
                        setKeyInput('');
                        updateApiKey('');
                        setShowModal(false);
                        window.location.reload();
                      }}
                    >
                      Clear Key
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-gradient btn-sm">
                    Save Key & Refresh
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}