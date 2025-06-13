import React, { useState } from "react";
import { BackButton } from "../../shared/back-button/BackButton";

const ExpandButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="container mt-4">
      <BackButton />
      <button className="btn btn-primary mb-2" onClick={toggleContent}>
        {isExpanded ? "Collapse" : "Expand"}
      </button>

      <div className={`collapse ${isExpanded ? "show" : ""}`}>
        <div className="card card-body">
          This is the expandable content. You can put anything here, like
          details, forms, or descriptions.
        </div>
      </div>
    </div>
  );
};

export default ExpandButton;
