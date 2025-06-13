// src/components/CatGenerator.tsx
import React, { useState } from "react";
import { Container, Button, Card, Spinner } from "react-bootstrap";
import { BackButton } from "../../shared/back-button/BackButton";

const CatGenerator: React.FC = () => {
  const [catUrl, setCatUrl] = useState<string>("https://cataas.com/cat");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNewCat = () => {
    setLoading(true);
    // Add timestamp to avoid cached image
    const newUrl = `https://cataas.com/cat?timestamp=${new Date().getTime()}`;
    setCatUrl(newUrl);
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <BackButton />
      <Card className="shadow-lg" style={{ width: "300px" }}>
        <Card.Img
          variant="top"
          src={catUrl}
          alt="Random Cat"
          style={{ width: "100%", height: "40vh", objectFit: "cover" }}
          onLoad={() => setLoading(false)}
        />
        <Card.Body className="text-center">
          <Button variant="primary" onClick={fetchNewCat} disabled={loading}>
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Loading...
              </>
            ) : (
              "Generate New Cat"
            )}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CatGenerator;
