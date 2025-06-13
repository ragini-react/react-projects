import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { BackButton } from "../../shared/back-button/BackButton";

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<number>(160);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  const [bmi, setBMI] = useState<number | null>(null);

  const calculateBMI = () => {
    const totalInches = heightFeet * 12 + heightInches;
    const bmiValue = (weight / (totalInches * totalInches)) * 703;
    setBMI(parseFloat(bmiValue.toFixed(1)));
  };

  const getColorClass = (bmi: number | null) => {
    if (bmi === null) return "bg-secondary";
    if (bmi < 18.5) return "bg-warning text-dark";
    if (bmi <= 25) return "bg-success";
    if (bmi <= 30) return "bg-orange text-white";
    return "bg-danger";
  };

  return (
    <Container className="my-5">
      <BackButton />
      <h2 className="mb-4 text-center">BMI Calculator</h2>

      <Card className="p-4 bg-light">
        <Row className="mb-3 text-center">
          <Col>
            <strong>Units</strong>
          </Col>
          <Col>
            <span className="form-control-plaintext">Standard</span>
          </Col>
        </Row>

        <Row className="mb-3 align-items-center">
          <Col md={4}>
            <strong>Weight</strong>
          </Col>
          <Col md={4}>
            <Form.Control
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
            />
          </Col>
          <Col md={4}>
            <span>pounds</span>
          </Col>
        </Row>

        <Row className="mb-3 align-items-center">
          <Col md={4}>
            <strong>Height</strong>
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              value={heightFeet}
              onChange={(e) => setHeightFeet(parseInt(e.target.value))}
            />
          </Col>
          <Col md={1}>
            <span>feet</span>
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              value={heightInches}
              onChange={(e) => setHeightInches(parseInt(e.target.value))}
            />
          </Col>
          <Col md={1}>
            <span>inches</span>
          </Col>
        </Row>

        <Row className="text-center">
          <Col>
            <Button onClick={calculateBMI}>Calculate BMI</Button>
          </Col>
        </Row>
      </Card>

      {bmi !== null && (
        <Card className={`text-white text-center mt-4 ${getColorClass(bmi)}`}>
          <Card.Body className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Your BMI:</h5>
            <h2 className="mb-0">{bmi}</h2>
          </Card.Body>
        </Card>
      )}

      <Row className="mt-4 text-center">
        <Col className="bg-warning text-dark p-2">
          Underweight <br /> &lt; 18.5
        </Col>
        <Col className="bg-success text-white p-2">
          Normal weight <br /> 18.5 - 25
        </Col>
        <Col className="bg-orange text-white p-2">
          Overweight <br /> 25 - 30
        </Col>
        <Col className="bg-danger text-white p-2">
          Obese <br /> &gt; 30
        </Col>
      </Row>
    </Container>
  );
};

export default BMICalculator;
