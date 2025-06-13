import React, { useEffect, useState } from "react";
import { BackButton } from "../../shared/back-button/BackButton";

const DigitalClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const getDay = (date: Date) =>
    date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();

  const getDate = (date: Date) => {
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month} ${day} ${year}`;
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-dark text-white">
      <BackButton />

      <div
        className="bg-black text-white text-center p-4 rounded shadow"
        style={{ width: "400px" }}>
        <h2 className="fw-bold display-6 mb-3" style={{ letterSpacing: "4px" }}>
          {getDay(currentTime)}
        </h2>

        <h1 className="fw-bold display-1 mb-3">{formatTime(currentTime)}</h1>

        <h4 className="fw-semibold" style={{ letterSpacing: "3px" }}>
          {getDate(currentTime)}
        </h4>
      </div>
    </div>
  );
};

export default DigitalClock;
