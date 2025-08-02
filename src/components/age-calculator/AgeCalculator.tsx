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
    <div className="min-vh-100 bg-gradient d-flex justify-content-center align-items-center position-relative" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <BackButton />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white text-center py-3">
                <h4 className="mb-0 fw-bold">
                  <i className="bi bi-calendar-date me-2"></i>
                  Age Calculator
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="row g-2 mb-4">
                  <div className="col-4">
                    <label className="form-label small text-muted fw-semibold">Day</label>
                    <input
                      type="number"
                      className="form-control form-control-lg text-center"
                      placeholder="DD"
                      min="1"
                      max="31"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label small text-muted fw-semibold">Month</label>
                    <input
                      type="number"
                      className="form-control form-control-lg text-center"
                      placeholder="MM"
                      min="1"
                      max="12"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    />
                  </div>
                  <div className="col-4">
                    <label className="form-label small text-muted fw-semibold">Year</label>
                    <input
                      type="number"
                      className="form-control form-control-lg text-center"
                      placeholder="YYYY"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="d-grid">
                  <button 
                    className="btn btn-primary btn-lg fw-semibold" 
                    onClick={calculateAge}
                    disabled={!day || !month || !year}
                  >
                    <i className="bi bi-calculator me-2"></i>
                    Calculate Age
                  </button>
                </div>

                {age && (
                  <div className="mt-4">
                    <div className="alert alert-success border-0 shadow-sm">
                      <h5 className="alert-heading text-center mb-3">
                        <i className="bi bi-check-circle me-2"></i>
                        Your Age Results
                      </h5>
                      <div className="row g-3">
                        <div className="col-12">
                          <div className="bg-light rounded p-3 text-center">
                            <h6 className="text-primary mb-2">Primary Age</h6>
                            <div className="h5 mb-0 text-dark">
                              {age.years} years, {age.months} months, {age.days} days
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="bg-light rounded p-3 text-center">
                            <div className="text-muted small">Total Months</div>
                            <div className="fw-bold text-primary">{age.totalMonths}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="bg-light rounded p-3 text-center">
                            <div className="text-muted small">Total Weeks</div>
                            <div className="fw-bold text-primary">{age.totalWeeks}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="bg-light rounded p-3 text-center">
                            <div className="text-muted small">Total Days</div>
                            <div className="fw-bold text-primary">{age.totalDays.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="bg-light rounded p-3 text-center">
                            <div className="text-muted small">Total Hours</div>
                            <div className="fw-bold text-primary">{age.totalHours.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="row g-2">
                            <div className="col-6">
                              <div className="bg-light rounded p-2 text-center">
                                <div className="text-muted small">Minutes</div>
                                <div className="fw-bold text-success small">{age.totalMinutes.toLocaleString()}</div>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="bg-light rounded p-2 text-center">
                                <div className="text-muted small">Seconds</div>
                                <div className="fw-bold text-success small">{age.totalSeconds.toLocaleString()}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;
