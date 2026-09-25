# MovieMint 🍃

A modern, responsive React web application powered by **Vite**, **Bootstrap 5**, **React Router v6**, and **The Movie Database (TMDB) API**.

## 🌟 Features

- **Dynamic TMDB API Integration**: Live Trending, Top Rated, and Popular movies fetched directly from TMDB CDN.
- **Graceful Offline / Fallback Support**: Built-in fallback dataset ensures the application works smoothly even without an API key.
- **TMDB Key Settings UI**: Change or test your TMDB API Key directly from the top navigation bar modal.
- **Search & Filtering**: Real-time search by movie title, genre filtering, and sorting (Highest Rating, Newest First).
- **Movie Details & Recommendations**: Comprehensive details view with poster, backdrop, overview, runtime, ratings, and similar movie suggestions.
- **Personal Watchlist**: Save and remove movies to/from your personal collection backed by `LocalStorage`.
- **User Authentication (Frontend Demo)**: Simulated Signup & Login flow with state persistence.

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/diyathakrar68-design/Movie-Explorer-FEWT-project-.git
cd Movie-Explorer-FEWT-project-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. (Optional) Set TMDB API Key
Copy `.env.example` to `.env` and add your TMDB API Key:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```
*(Alternatively, enter your key inside the application navbar anytime!)*

### 4. Run Development Server
```bash
npm run dev
```

---

## 🛠 Tech Stack

- **Framework**: React (Vite)
- **Styling**: Bootstrap 5 + Custom CSS Glassmorphism
- **Routing**: React Router DOM v6
- **API**: TMDB (The Movie Database) API v3
- **State & Storage**: React Context API & LocalStorage
