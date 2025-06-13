import React from "react";
import { Row, Col } from "react-bootstrap";
import MovieCard, { Movie } from "../movie-card/MovieCard";

interface Props {
  movies: Movie[];
}

const MovieList: React.FC<Props> = ({ movies }) => {
  return (
    <Row>
      {movies.map((movie) => (
        <Col key={movie.imdbID} sm={6} md={4} lg={3}>
          <MovieCard movie={movie} />
        </Col>
      ))}
    </Row>
  );
};

export default MovieList;
