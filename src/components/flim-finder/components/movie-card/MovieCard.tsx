import React from "react";
import { Card } from "react-bootstrap";

export interface Movie {
  Title: string;
  Year: string;
  Poster: string;
  imdbID: string;
}

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Img
        variant="top"
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x445?text=No+Image"
        }
      />
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        <Card.Text>Year: {movie.Year}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
