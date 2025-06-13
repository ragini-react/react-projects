import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BackButton } from "../../shared/back-button/BackButton";

const BatteryIndicator: React.FC = () => {
  const batteryLevel = 75; // Change this dynamically as needed

  const getBarClass = (level: number) => {
    if (batteryLevel >= level) return "";
    return "opacity-25";
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <BackButton />
      <h2 className="text-primary fw-bold text-center mb-4">
        How to make <br /> 3.7 Volt Battery Level Indicator
      </h2>

      {/* Battery container */}
      <div
        className="d-flex flex-column border border-dark rounded p-1"
        style={{ width: "70px", height: "180px", position: "relative" }}>
        {/* Top cap */}
        <div
          className="bg-dark position-absolute top-0 start-50 translate-middle rounded"
          style={{ width: "30px", height: "10px", top: "-12px" }}></div>

        {/* Battery levels */}
        <div
          className={`flex-fill bg-success w-100 rounded-1 mb-1 ${getBarClass(
            100
          )}`}></div>
        <div
          className={`flex-fill bg-warning w-100 rounded-1 mb-1 ${getBarClass(
            75
          )}`}></div>
        <div
          className={`flex-fill bg-warning w-100 rounded-1 mb-1 ${getBarClass(
            50
          )}`}
          style={{ backgroundColor: "#fd7e14" }}></div>
        <div
          className={`flex-fill bg-danger w-100 rounded-1 ${getBarClass(
            25
          )}`}></div>
      </div>

      {/* Labels */}
      <div className="text-center mt-3">
        <p className="text-success fw-semibold">100%</p>
        <p className="text-warning fw-semibold">75%</p>
        <p style={{ color: "#fd7e14" }} className="fw-semibold">
          50%
        </p>
        <p className="text-danger fw-semibold">25%</p>
      </div>
    </div>
  );
};

export default BatteryIndicator;
