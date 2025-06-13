import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BackButton } from "../../shared/back-button/BackButton";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

const AgeCalculator: React.FC = () => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [age, setAge] = useState<AgeResult | null>(null);

  const calculateAge = () => {
    if (!day || !month || !year) return;

    const birthDate = new Date(
      `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    );
    const now = new Date();

    if (birthDate > now) return;

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMs = now.getTime() - birthDate.getTime();
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(totalMs / (1000 * 60));
    const totalSeconds = Math.floor(totalMs / 1000);

    setAge({
      years,
      months,
      days,
      totalMonths: years * 12 + months,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
    });
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-primary position-relative">
      <BackButton />
      <div className="bg-white p-4 rounded shadow" style={{ width: "350px" }}>
        <h4 className="text-center mb-4">Age Calculator</h4>
        <div className="d-flex justify-content-between mb-3">
          <input
            type="number"
            className="form-control me-1"
            placeholder="Date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
          <input
            type="number"
            className="form-control mx-1"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <input
            type="number"
            className="form-control ms-1"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="text-center">
          <button className="btn btn-primary w-100" onClick={calculateAge}>
            Submit
          </button>
        </div>

        {age && (
          <div className="mt-4 text-start text-primary fw-semibold">
            <h5 className="text-black mb-3 text-center">Your Age is:</h5>
            <ul className="list-unstyled text-black small d-flex flex-column gap-2">
              <li className="border p-2">
                → {age.years} years {age.months} months {age.days} days
              </li>
              <li className="border p-2">
                → {age.totalMonths} months {age.days} days
              </li>
              <li className="border p-2">
                → {age.totalWeeks} weeks {age.totalDays % 7} days
              </li>
              <li className="border p-2">
                → {age.totalDays.toLocaleString()} days
              </li>
              <li className="border p-2">
                → {age.totalHours.toLocaleString()} hours
              </li>
              <li className="border p-2">
                → {age.totalMinutes.toLocaleString()} minutes
              </li>
              <li className="border p-2">
                → {age.totalSeconds.toLocaleString()} seconds
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeCalculator;
