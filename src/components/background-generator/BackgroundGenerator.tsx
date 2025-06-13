import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BackButton } from "../../shared/back-button/BackButton";

const BackgroundGenerator: React.FC = () => {
  const [backgroundColor, setBackgroundColor] = useState<string>("#000000"); // Initial background color
  const [userColor, setUserColor] = useState<string>(""); // User input color

  // Function to generate a random color
  const generateRandomColor = (): void => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16); // Generate hex color
    setBackgroundColor(randomColor); // Set the background color state
    setUserColor(randomColor);
  };

  // Function to handle user input
  const handleUserColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const color = e.target.value;

    // Check if the input is a valid hex color code
    if (/^#[0-9A-Fa-f]{6}$/i.test(color)) {
      setUserColor(color);
      setBackgroundColor(color); // Update background with user-defined color
    } else {
      // Optionally, you can clear the color if invalid input is entered
      setUserColor(color);
    }
  };

  return (
    <Container
      fluid
      style={{
        backgroundColor: backgroundColor,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <BackButton />
      <Row>
        <Col className="text-center">
          <h1 className="text-white">Background Color Generator</h1>

          {/* User input field to define color */}
          <Form.Group
            controlId="userColorInput"
            style={{ width: "fit-content" }}
            className="mx-auto">
            <Form.Label className="text-white">
              Enter Hex Color Code:
            </Form.Label>
            <Form.Control
              type="text"
              value={userColor}
              onChange={handleUserColorChange}
              placeholder="#RRGGBB"
              maxLength={7}
            />
          </Form.Group>

          {/* Button to generate random color */}
          <Button
            variant="primary"
            className="mt-3"
            onClick={generateRandomColor}>
            Generate Random Color
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default BackgroundGenerator;
