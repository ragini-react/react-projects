import React, { useState, useRef, useEffect } from "react";
import { Form } from "react-bootstrap";
import { BackButton } from "../../shared/back-button/BackButton";
// import "./CustomSlider.css";

interface CustomSliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  min = 0,
  max = 200,
  defaultValue = 100,
  onChange,
}) => {
  const [value, setValue] = useState<number>(defaultValue);
  const rangeRef = useRef<HTMLInputElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const updateBubblePosition = () => {
    if (rangeRef.current && bubbleRef.current) {
      const range = rangeRef.current;
      const bubble = bubbleRef.current;
      const percent = ((value - min) / (max - min)) * 100;
      bubble.style.left = `calc(${percent}% - 20px)`;
    }
  };

  useEffect(() => {
    updateBubblePosition();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary text-white">
      <BackButton />
      <div
        className="bg-white text-dark p-4 rounded position-relative"
        style={{ width: "400px" }}>
        <div ref={bubbleRef} className="bubble">
          {value}
        </div>
        <Form.Range
          ref={rangeRef}
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
        />
        <div className="d-flex justify-content-between mt-2 fw-bold text-primary">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomSlider;
