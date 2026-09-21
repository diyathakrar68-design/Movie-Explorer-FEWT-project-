import { movies as staticMovies } from '../data/movies';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// Helper to get active API key from env or localStorage
export const getApiKey = () => {
  return (
    import.meta.env.VITE_TMDB_API_KEY ||
    localStorage.getItem('tmdb_api_key') ||
    ''
  );
};

export const setApiKey = (key) => {
  if (key) {
    localStorage.setItem('tmdb_api_key', key.trim());
  } else {
    localStorage.removeItem('tmdb_api_key');
  }
};

let genreMapCache = null;

export const fetchGenres = async () => {
  const apiKey = getApiKey();
  if (!apiKey) return [];
  if (genreMapCache) return genreMapCache;

  try {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${apiKey}&language=en-US`);
    if (!res.ok) throw new Error('Failed to fetch genres');
    const data = await res.json();
    genreMapCache = data.genres || [];
    return genreMapCache;
  } catch (e) {
    console.warn('TMDB fetchGenres fallback:', e);
    return [];
  }
};

export const formatMovie = (tmdbMovie, genresList = []) => {
  if (!tmdbMovie) return null;

  // Genre resolution
  let genreNames = '';
  if (tmdbMovie.genres && Array.isArray(tmdbMovie.genres)) {
    genreNames = tmdbMovie.genres.map((g) => g.name).join(' / ');
  } else if (tmdbMovie.genre_ids && genresList.length > 0) {
    genreNames = tmdbMovie.genre_ids
      .map((id) => {
        const found = genresList.find((g) => g.id === id);
        return found ? found.name : null;
      })
      .filter(Boolean)
      .slice(0, 2)
      .join(' / ');
  }

  const year = tmdbMovie.release_date
    ? new Date(tmdbMovie.release_date).getFullYear()
    : 'N/A';

  const poster = tmdbMovie.poster_path
    ? `${IMAGE_BASE_URL}w500${tmdbMovie.poster_path}`
    : tmdbMovie.id <= 15
    ? `/posters/${tmdbMovie.id}.svg`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const backdrop = tmdbMovie.backdrop_path
    ? `${IMAGE_BASE_URL}w1280${tmdbMovie.backdrop_path}`
    : null;

  const rating = tmdbMovie.vote_average
    ? Number(tmdbMovie.vote_average).toFixed(1)
    : 'N/A';

  const duration = tmdbMovie.runtime
    ? `${Math.floor(tmdbMovie.runtime / 60)}h ${tmdbMovie.runtime % 60}m`
    : '2h 10m';

  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title || tmdbMovie.original_title,
    year: year,
    rating: rating,
    genre: genreNames || 'Movie',
    duration: duration,
    category: tmdbMovie.category || 'popular',
    desc: tmdbMovie.overview || 'No description available.',
    poster: poster,
    backdrop: backdrop,
    voteCount: tmdbMovie.vote_count || 0,
    isDynamic: true,
  };
};

export const getTrendingMovies = async () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return staticMovies.filter((m) => m.category === 'latest');
  }

  try {
    const genres = await fetchGenres();
    const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${apiKey}`);
    if (!res.ok) throw new Error('Failed to fetch trending movies');
    const data = await res.json();
    return data.results.map((m) => formatMovie(m, genres));
  } catch (err) {
    console.warn('TMDB API Error, using static movies fallback:', err);
    return staticMovies.filter((m) => m.category === 'latest');
  }
};

export const getTopRatedMovies = async () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return staticMovies.filter((m) => m.category === 'top');
  }

  try {
    const genres = await fetchGenres();
    const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`);
    if (!res.ok) throw new Error('Failed to fetch top rated movies');
    const data = await res.json();
    return data.results.map((m) => formatMovie(m, genres));
  } catch (err) {
    console.warn('TMDB API Error, using static movies fallback:', err);
    return staticMovies.filter((m) => m.category === 'top');
  }
};

export const getPopularMovies = async () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return staticMovies.filter((m) => m.category === 'popular');
  }

  try {
    const genres = await fetchGenres();
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
    if (!res.ok) throw new Error('Failed to fetch popular movies');
    const data = await res.json();
    return data.results.map((m) => formatMovie(m, genres));
  } catch (err) {
    console.warn('TMDB API Error, using static movies fallback:', err);
    return staticMovies.filter((m) => m.category === 'popular');
  }
};

export const searchOrDiscoverMovies = async ({ query = '', genreId = '', sortBy = '' } = {}) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    let list = staticMovies.filter((m) => {
      const matchQ =
        !query ||
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.genre.toLowerCase().includes(query.toLowerCase());
      const matchG = !genreId || m.genre.toLowerCase().includes(genreId.toLowerCase());
      return matchQ && matchG;
    });
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'year') list = [...list].sort((a, b) => b.year - a.year);
    return list;
  }

  try {
    const genres = await fetchGenres();
    let url = `${BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&sort_by=${
      sortBy === 'rating' ? 'vote_average.desc' : sortBy === 'year' ? 'primary_release_date.desc' : 'popularity.desc'
    }`;

    if (query.trim()) {
      url = `${BASE_URL}/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query.trim())}`;
    } else if (genreId) {
      url += `&with_genres=${genreId}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return data.results.map((m) => formatMovie(m, genres));
  } catch (err) {
    console.warn('TMDB API Error, returning static filter fallback:', err);
    return staticMovies;
  }
};

export const getMovieDetails = async (id) => {
  const apiKey = getApiKey();
  const numericId = Number(id);

  // Check static fallback first if not numeric or no API key
  const staticFound = staticMovies.find((m) => m.id === numericId);

  if (!apiKey) {
    return {
      movie: staticFound || staticMovies[0],
      similar: staticMovies.filter((m) => m.id !== numericId).slice(0, 5),
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${apiKey}&language=en-US`);
    if (!res.ok) {
      if (staticFound) {
        return {
          movie: staticFound,
          similar: staticMovies.filter((m) => m.id !== numericId).slice(0, 5),
        };
      }
      throw new Error('Movie details fetch failed');
    }

    const data = await res.json();
    const formatted = formatMovie(data);

    // Fetch recommendations / similar movies
    const simRes = await fetch(`${BASE_URL}/movie/${id}/recommendations?api_key=${apiKey}&language=en-US`);
    let similarList = [];
    if (simRes.ok) {
      const simData = await simRes.json();
      similarList = simData.results.slice(0, 5).map((m) => formatMovie(m));
    }

    return {
      movie: formatted,
      similar: similarList,
    };
  } catch (err) {
    console.warn('TMDB API getMovieDetails error, using static fallback:', err);
    return {
      movie: staticFound || staticMovies[0],
      similar: staticMovies.filter((m) => m.id !== (staticFound?.id || 1)).slice(0, 5),
    };
  }
};
