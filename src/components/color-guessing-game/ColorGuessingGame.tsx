import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Alert,
  Card,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";
import { BackButton } from "../../shared/back-button/BackButton";

type ColorMode = "rgb" | "hex";

const getRandomRGB = (): [number, number, number] => [
  Math.floor(Math.random() * 256),
  Math.floor(Math.random() * 256),
  Math.floor(Math.random() * 256),
];

const rgbToString = (rgb: [number, number, number]) =>
  `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

const rgbToHex = (rgb: [number, number, number]) =>
  `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;

const getFormattedColor = (
  rgb: [number, number, number],
  mode: ColorMode
): string => (mode === "rgb" ? rgbToString(rgb) : rgbToHex(rgb));

const generateColorOptions = (
  correctRGB: [number, number, number],
  count: number,
  mode: ColorMode
): [string[], string] => {
  const correct = getFormattedColor(correctRGB, mode);
  const colors = new Set<string>();
  colors.add(correct);
  while (colors.size < count) {
    const randomRGB = getRandomRGB();
    colors.add(getFormattedColor(randomRGB, mode));
  }
  const colorList = Array.from(colors).sort(() => Math.random() - 0.5);
  return [colorList, correct];
};

const ColorGuessGame: React.FC = () => {
  const [correctRGB, setCorrectRGB] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const [correctColor, setCorrectColor] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [mode, setMode] = useState<ColorMode>("rgb");

  const newGame = (selectedMode = mode) => {
    const newRGB = getRandomRGB();
    const [colors, correct] = generateColorOptions(newRGB, 6, selectedMode);
    setCorrectRGB(newRGB);
    setCorrectColor(correct);
    setOptions(colors);
    setMessage("");
    setGameOver(false);
  };

  useEffect(() => {
    newGame();
  }, []);

  // Regenerate colors on mode change
  useEffect(() => {
    newGame(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleGuess = (color: string) => {
    if (color === correctColor) {
      setMessage("🎉 Correct! +1 point");
      setScore((prev) => prev + 1);
      setGameOver(true);
    } else {
      setMessage("❌ Wrong! Try again!");
    }
  };

  return (
    <Container className="text-center mt-5">
      <BackButton />
      <h3 className="mb-3">🎨 Color Guessing Game</h3>

      <Card className="mb-3 p-3">
        <h5>
          Guess the color: <strong>{correctColor}</strong>
        </h5>
      </Card>

      <div className="mb-2">
        <ButtonGroup>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            name="mode"
            value="rgb"
            checked={mode === "rgb"}
            onChange={() => setMode("rgb")}
            id={""}>
            RGB
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-primary"
            name="mode"
            value="hex"
            checked={mode === "hex"}
            onChange={() => setMode("hex")}
            id={""}>
            HEX
          </ToggleButton>
        </ButtonGroup>
      </div>

      <div className="mb-3">
        <strong>Score:</strong> {score}
      </div>

      {message && (
        <Alert variant={gameOver ? "success" : "danger"}>{message}</Alert>
      )}

      <Row className="g-3 justify-content-center">
        {options.map((color, index) => (
          <Col xs={6} md={4} key={index}>
            <Button
              style={{
                backgroundColor: color,
                width: "100%",
                height: "80px",
                border: "2px solid #fff",
              }}
              onClick={() => handleGuess(color)}
              disabled={gameOver}
            />
          </Col>
        ))}
      </Row>

      <Button className="mt-4" onClick={() => newGame()} variant="primary">
        🔄 Play Again
      </Button>
    </Container>
  );
};

export default ColorGuessGame;
