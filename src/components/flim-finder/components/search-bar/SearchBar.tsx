import React from "react";
import { Form, InputGroup } from "react-bootstrap";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onChange }) => {
  return (
    <InputGroup className="mb-4">
      <Form.Control
        placeholder="Search movies..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
};

export default SearchBar;
