import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Gallery from "./components/Gallery";
import "./App.css";

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const cache = useRef({}); // Cache fetched photos

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(false);

    if (cache.current[page]) {
      // Use cached data if available
      setPhotos((prev) => [...prev, ...cache.current[page]]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos?page=${page}&per_page=12`,
        {
          headers: {
            Authorization: `Client-ID 96BBf-WxKfFIM-yZuFfu7P5w0VzhIAV4lfOqjikJIk4`,
          },
        }
      );
      cache.current[page] = response.data; // Cache the fetched data
      setPhotos((prev) => [...prev, ...response.data]);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page]); // useCallback ensures fetchPhotos is memoized and only changes when 'page' changes

  useEffect(() => {
    fetchPhotos();
  }, [page, fetchPhotos]); // Added fetchPhotos to the dependency array

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading]); // useCallback ensures handleScroll is memoized and only changes when 'loading' changes

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]); // Added handleScroll to the dependency array

  return (
    <div className="app">
      <header className="header">
        <h1>Infinite Scroll Photo Gallery</h1>
      </header>
      {error && <p className="error">Failed to load images. Please try again.</p>}
      <Gallery photos={photos} />
      {loading && <div className="loading">Loading...</div>}
    </div>
  );
};

export default App;
