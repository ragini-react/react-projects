import React, { useState, useEffect } from "react";
import { Container, Spinner, Alert, Row, Col } from "react-bootstrap";
import SearchBar from "./components/search-bar/SearchBar";
import MovieList from "./components/movie-list/MovieList";
import { Movie } from "./components/movie-card/MovieCard";
import axios from "axios";
import { BackButton } from "../../shared/back-button/BackButton";
import "./FlimFinderLayout.scss";

// Using a demo API key - replace with your real OMDB API key
const API_KEY = "8265bd1679663a7ea12ac168da84d2e8"; // Demo key for testing

const FlimFinderLayout: React.FC = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchMovies = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setTotalResults(0);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(searchQuery)}&type=movie`
      );
      
      if (res.data.Response === "True") {
        setMovies(res.data.Search || []);
        setTotalResults(parseInt(res.data.totalResults) || 0);
      } else {
        setMovies([]);
        setTotalResults(0);
        setError(res.data.Error || "No movies found for your search.");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setMovies([]);
      setTotalResults(0);
      setError("Failed to fetch movies. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setTotalResults(0);
      setHasSearched(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchMovies(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSuggestionSelect = (suggestion: string) => {
    fetchMovies(suggestion);
  };

  const getWelcomeMessage = () => {
    if (!hasSearched && !query) {
      return (
        <div className="welcome-section text-center py-5">
          <div className="welcome-icon mb-3">
            🎬
          </div>
          <h2 className="welcome-title mb-3">Discover Amazing Movies</h2>
          <p className="welcome-text mb-4">
            Search for your favorite movies and discover new ones. Try searching for popular titles like:
          </p>
          <div className="popular-suggestions">
            {["The Dark Knight", "Inception", "Avengers", "Titanic", "Star Wars"].map((movie) => (
              <button
                key={movie}
                className="btn btn-outline-primary me-2 mb-2"
                onClick={() => setQuery(movie)}
              >
                {movie}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Container className="py-5 film-finder">
      <BackButton />
      
      <div className="header-section text-center mb-5">
        <h1 className="page-title mb-3">
          <i className="fas fa-film me-3"></i>
          Film Finder
        </h1>
        <p className="page-subtitle">
          Search and discover movies from our extensive database
        </p>
      </div>

      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <SearchBar 
            query={query} 
            onChange={setQuery} 
            onSuggestionSelect={handleSuggestionSelect}
          />
        </Col>
      </Row>

      {error && (
        <Alert variant="warning" className="text-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="loading-text">Searching for movies...</p>
        </div>
      ) : (
        <>
          {getWelcomeMessage()}
          
          {hasSearched && movies.length > 0 && (
            <div className="results-header mb-4">
              <h3 className="results-title">
                <i className="fas fa-search me-2"></i>
                Search Results for "{query}"
              </h3>
              <p className="results-count">
                Found {totalResults} movie{totalResults !== 1 ? 's' : ''} 
                {movies.length < totalResults && ` (showing first ${movies.length})`}
              </p>
            </div>
          )}
          
          <MovieList movies={movies} />
        </>
      )}
    </Container>
  );
};

export default FlimFinderLayout;
