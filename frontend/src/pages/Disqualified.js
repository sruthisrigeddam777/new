import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Disqualified = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/student-dashboard");  // typo fixed from dashbaord
  };
  useEffect(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div className="text-center mt-5">
      <h1 className="text-danger">❌ You have been disqualified</h1>
      <p>Your behavior violated exam proctoring rules.</p>
      <Button variant="primary" onClick={handleGoToDashboard}>
        Go to Dashboard
      </Button>
    </div>
  );
};

export default Disqualified;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {Button} from "react-bootstrap";

// const Disqualified = () => (
//     <div className="text-center mt-5">
//       <h1 className="text-danger">❌ You have been disqualified</h1>
//       <p>Your behavior violated exam proctoring rules.</p>
//       <Button variant="primary" onClick={() => navigate("/student-dashbaord")}>Go to Dashboard</Button>
//     </div>
//   );

// export default Disqualified;