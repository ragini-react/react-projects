import React, { useState, useEffect, useRef } from "react";
import { Form, InputGroup, ListGroup } from "react-bootstrap";
import "./SearchBar.scss";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onSuggestionSelect: (suggestion: string) => void;
}

// Popular movie suggestions for better UX
const POPULAR_MOVIES = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Dark Knight",
  "Pulp Fiction",
  "Forrest Gump",
  "Inception",
  "The Matrix",
  "Goodfellas",
  "The Lord of the Rings",
  "Star Wars",
  "Titanic",
  "Avatar",
  "Avengers",
  "Jurassic Park",
  "Spider-Man",
  "Batman",
  "Iron Man",
  "Harry Potter",
  "Fast and Furious",
  "Mission Impossible"
];

const SearchBar: React.FC<SearchBarProps> = ({ query, onChange, onSuggestionSelect }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const filteredSuggestions = POPULAR_MOVIES
        .filter(movie => 
          movie.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Show max 5 suggestions
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setActiveSuggestion(-1);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect(suggestion);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestion >= 0) {
          handleSuggestionClick(suggestions[activeSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <InputGroup className="mb-4">
        <InputGroup.Text>
          <i className="fas fa-search"></i>
        </InputGroup.Text>
        <Form.Control
          ref={inputRef}
          placeholder="Search movies... (e.g., The Dark Knight, Avengers)"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className="search-input"
        />
        {query && (
          <InputGroup.Text 
            className="clear-button" 
            onClick={() => {
              onChange('');
              setShowSuggestions(false);
              inputRef.current?.focus();
            }}
          >
            <i className="fas fa-times"></i>
          </InputGroup.Text>
        )}
      </InputGroup>
      
      {showSuggestions && suggestions.length > 0 && (
        <ListGroup className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <ListGroup.Item
              key={suggestion}
              className={`suggestion-item ${
                index === activeSuggestion ? 'active' : ''
              }`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setActiveSuggestion(index)}
            >
              <i className="fas fa-film me-2"></i>
              {suggestion}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default SearchBar;
