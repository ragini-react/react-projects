import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { BackButton } from "../../shared/back-button/BackButton";

const CompoundInterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [frequency, setFrequency] = useState<number>(1);
  const [result, setResult] = useState<{
    amount: number;
    interest: number;
  } | null>(null);

  const calculateInterest = () => {
    const r = rate / 100;
    const n = frequency;
    const t = time;
    const amount = principal * Math.pow(1 + r / n, n * t);
    const interest = amount - principal;
    setResult({
      amount: parseFloat(amount.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
    });
  };

  return (
    <Container className="mt-5">
      <BackButton />
      <Card className="p-4 shadow">
        <h2 className="text-center mb-4">Compound Interest Calculator</h2>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Label>Principal Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
              />
            </Col>
            <Col>
              <Form.Label>Annual Interest Rate (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Time (Years)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={time}
                onChange={(e) => setTime(Number(e.target.value))}
              />
            </Col>
            <Col>
              <Form.Label>Compounding Frequency (per Year)</Form.Label>
              <Form.Select
                value={frequency}
                onChange={(e) => setFrequency(Number(e.target.value))}>
                <option value={1}>Annually (1)</option>
                <option value={2}>Semi-Annually (2)</option>
                <option value={4}>Quarterly (4)</option>
                <option value={12}>Monthly (12)</option>
                <option value={365}>Daily (365)</option>
              </Form.Select>
            </Col>
          </Row>

          <Button variant="primary" onClick={calculateInterest}>
            Calculate
          </Button>
        </Form>

        {result && (
          <div className="mt-4">
            <h5>Total Amount: ₹{result.amount}</h5>
            <h6>Compound Interest: ₹{result.interest}</h6>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default CompoundInterestCalculator;
