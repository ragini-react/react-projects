import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { BackButton } from "../../shared/back-button/BackButton";

const buttonValues = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "=", "+"],
  ["AC", "%"],
];

const CalculatorApp: React.FC = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value: string) => {
    if (value === "AC") {
      setInput("");
      setResult("");
    } else if (value === "=") {
      try {
        const evalResult = eval(input);
        setResult(evalResult.toString());
      } catch (error) {
        setResult("Error");
      }
    } else {
      setInput((prev) => prev + value);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key } = event;
    if (/^[0-9+\-*/.%]$/.test(key)) {
      setInput((prev) => prev + key);
    } else if (key === "Enter") {
      handleClick("=");
    } else if (key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
    } else if (key === "Escape") {
      handleClick("AC");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 bg-black">
      <BackButton />
      <div
        className="bg-dark text-white rounded-4 shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}>
        <Form.Control
          className="fs-3 text-end bg-black text-white border-0 mb-2"
          value={input}
          readOnly
        />
        <div className="text-warning text-end fs-3 mb-3">{result}</div>
        {buttonValues.map((row, i) => (
          <Row key={i} className="g-2 mb-2">
            {row.map((btn) => (
              <Col xs={btn === "0" ? 6 : 3} key={btn}>
                <Button
                  variant={btn === "=" ? "warning" : "secondary"}
                  className="w-100 py-3 fs-4 rounded-3"
                  onClick={() => handleClick(btn)}>
                  {btn}
                </Button>
              </Col>
            ))}
          </Row>
        ))}
      </div>
    </Container>
  );
};

export default CalculatorApp;
