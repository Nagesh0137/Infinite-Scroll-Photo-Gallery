import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Gallery from "./components/Gallery";
import "./App.css";

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const cache = useRef({}); // Cache fetched photos

  const fetchPhotos = async () => {
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
  };

  useEffect(() => {
    fetchPhotos();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

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
