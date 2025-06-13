import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
  Table,
} from "react-bootstrap";
import { BackButton } from "../../shared/back-button/BackButton";
// import BackButton from "../shared/BackButton";

/**
 * ContactForm – A responsive contact form with live submission preview.
 *
 * Features:
 *  • React + TypeScript
 *  • react‑bootstrap styling (fully responsive)
 *  • Form validation via HTML5 required attrs
 *  • Fake async submit (replace with real API)
 *  • Displays each successful submission in a list under the form so
 *    the user can instantly verify what they sent.
 */

export default function ContactForm() {
  // ----------- State -------------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<(typeof formData)[]>([]);

  // ----------- Handlers ----------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API call or email service integration
      await new Promise((res) => setTimeout(res, 1500));
      setSubmitted(true);
      setEntries((prev) => [formData, ...prev]); // add new entry to top
      // clear form
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------- Render ------------
  return (
    <Container className="my-5 position-relative bg-primary p-4 rounded">
      <BackButton />
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2 className="mb-4 text-center">Contact Us</h2>
          {submitted && (
            <Alert
              variant="success"
              onClose={() => setSubmitted(false)}
              dismissible
              role="status">
              Thank you! Your message has been sent.
            </Alert>
          )}
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit} aria-label="Contact Form">
            <Form.Group controlId="contactName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="contactEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="contactMessage" className="mb-4">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                placeholder="Type your message here..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                size="lg">
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />{" "}
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>

      {/* Submissions Preview */}
      {entries.length > 0 && (
        <Row className="justify-content-center mt-5">
          <Col xs={12} md={10} lg={8}>
            <h3 className="mb-3 text-center">Your Submissions</h3>
            <Table responsive bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={idx}>
                    <td>{entries.length - idx}</td>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td style={{ whiteSpace: "pre-wrap" }}>{entry.message}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
}
