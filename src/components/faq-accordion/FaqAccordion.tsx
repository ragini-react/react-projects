import React from "react";
import { Accordion, Container } from "react-bootstrap";
import { BackButton } from "../../shared/back-button/BackButton";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is React?",
    answer: "React is a JavaScript library for building user interfaces.",
  },
  {
    question: "What is TypeScript?",
    answer:
      "TypeScript is a strongly typed programming language that builds on JavaScript.",
  },
  {
    question: "What is React-Bootstrap?",
    answer:
      "React-Bootstrap is a UI library that replaces Bootstrap’s JavaScript with React components.",
  },
];

const FaqAccordion: React.FC = () => {
  return (
    <Container className="my-5">
      <BackButton />
      <h2 className="mb-4 text-center">Frequently Asked Questions</h2>
      <Accordion defaultActiveKey="0">
        {faqs.map((faq, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>{faq.question}</Accordion.Header>
            <Accordion.Body>{faq.answer}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default FaqAccordion;
