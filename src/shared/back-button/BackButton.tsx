import { Box } from "@mui/material";
import { Link } from "react-router-dom";

export const BackButton = () => {
  return (
    <Box>
      <Link
        to="/"
        className="position-absolute top-0 start-0 m-3 btn btn-light border fw-semibold shadow-sm">
        ← Back
      </Link>
    </Box>
  );
};
