# MovieMint - Movie Exploration App

A responsive React web app built as part of the Front-End Web Technology (FEWT) lab project. The app uses React, Bootstrap 5, React Router, and TMDB API to display movies, Hindi films, cast information, and a personal watchlist.

## Features

- **Movie Sections**: Browse trending releases, top-rated movies, popular titles, and Bollywood/Hindi films.
- **Hero Slider & Carousel**: Featured movie banner carousel with auto-slide, search input, and slide controls.
- **Search & Filters**: Search movies by title, filter by genres (including Hindi movies), and sort by rating or year.
- **Movie Details & Cast**: View detailed information including posters, backdrops, plot summaries, ratings, runtime, and cast profiles.
- **Watchlist**: Save movies to your watchlist (persisted in `localStorage`).
- **TMDB API Integration**: Option to enter a custom TMDB API key in the navbar or use the built-in fallback movie collection.

## Tech Stack

- React (Vite)
- React Router DOM v6
- Bootstrap 5 + Custom CSS
- TMDB (The Movie Database) API

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/diyathakrar68-design/Movie-Explorer-FEWT-project-.git
   cd Movie-Explorer-FEWT-project-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
