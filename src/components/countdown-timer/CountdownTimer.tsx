import React, { useEffect, useState, useRef } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { BackButton } from "../../shared/back-button/BackButton";

const CountdownTimer: React.FC = () => {
  const [time, setTime] = useState(300); // 5 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = window.setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (time === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    }
  }, [time]);

  const handleStart = () => {
    if (!isRunning) setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    handlePause();
    setTime(300); // reset to 5 minutes
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minutes = parseInt(e.target.value) || 0;
    setTime(minutes * 60);
  };

  return (
    <Container className="text-center mt-5">
      <BackButton />
      <Row className="mb-4">
        <Col>
          <h1>{formatTime(time)}</h1>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={4} className="mx-auto">
          <Form.Group controlId="timeInput">
            <Form.Label>Set Minutes</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter minutes"
              onChange={handleTimeChange}
              disabled={isRunning}
              min={1}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="success" onClick={handleStart} disabled={isRunning}>
            Start
          </Button>{" "}
          <Button variant="warning" onClick={handlePause} disabled={!isRunning}>
            Pause
          </Button>{" "}
          <Button variant="danger" onClick={handleReset}>
            Reset
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CountdownTimer;
