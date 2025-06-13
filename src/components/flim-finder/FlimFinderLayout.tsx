import React, { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import SearchBar from "./components/search-bar/SearchBar";
import MovieList from "./components/movie-list/MovieList";
import { Movie } from "./components/movie-card/MovieCard";
import axios from "axios";
import { BackButton } from "../../shared/back-button/BackButton";

const API_KEY = "YOUR_OMDB_API_KEY"; // Replace with your real API key

const FlimFinderLayout: React.FC = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
        );
        setMovies(res.data.Search || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <Container className="py-5">
      <BackButton />
      <h1 className="text-center mb-4">🎬 Film Finder</h1>
      <SearchBar query={query} onChange={setQuery} />
      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <MovieList movies={movies} />
      )}
    </Container>
  );
};

export default FlimFinderLayout;
