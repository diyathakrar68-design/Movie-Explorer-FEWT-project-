import { createContext, useContext, useState, useEffect } from "react";
import { getApiKey, setApiKey as saveApiKeyToStorage } from "../services/tmdb";

const C = createContext();

export function AppProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() =>
    JSON.parse(localStorage.getItem("movieExplorerWatchlist") || "[]"),
  );
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("movieExplorerUser") || "null"),
  );
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("movieExplorerLoggedIn") === "true",
  );
  const [apiKey, setApiKey] = useState(() => getApiKey());

  const updateApiKey = (key) => {
    saveApiKeyToStorage(key);
    setApiKey(key);
  };

  const toggleWatchlist = (movieOrId) => {
    setWatchlist((prev) => {
      const id = typeof movieOrId === "object" ? movieOrId.id : movieOrId;
      const exists = prev.some((item) =>
        typeof item === "object" ? item.id === id : item === id,
      );

      let next;
      if (exists) {
        next = prev.filter((item) =>
          typeof item === "object" ? item.id !== id : item !== id,
        );
      } else {
        next = [...prev, movieOrId];
      }

      localStorage.setItem("movieExplorerWatchlist", JSON.stringify(next));
      return next;
    });
  };

  const login = (u) => {
    localStorage.setItem("movieExplorerLoggedIn", "true");
    localStorage.setItem("movieExplorerCurrentUser", JSON.stringify(u));
    setLoggedIn(true);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("movieExplorerLoggedIn");
    localStorage.removeItem("movieExplorerCurrentUser");
    setLoggedIn(false);
  };

  return (
    <C.Provider
      value={{
        watchlist,
        toggleWatchlist,
        user,
        setUser,
        loggedIn,
        login,
        logout,
        apiKey,
        updateApiKey,
      }}
    >
      {children}
    </C.Provider>
  );
}

export const useApp = () => useContext(C);
