import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const FaceTest = () => {
  const webcamRef = useRef(null);
  const [status, setStatus] = useState("Waiting...");

  const captureAndSend = async () => {
    if (!webcamRef.current) return;
    setTimeout(async () => {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setStatus("Could not capture image");
        return;
      }

      try {
        const res = await axios.post(
          "http://localhost:8000/auth/proctoring/verify-face/",
          imageSrc,
          { headers: { "Content-Type": "application/json" } }
        );
        setStatus(res.data.status);
      } catch (err) {
        console.error(err);
        setStatus("Error sending image");
      }
    }, 500); // wait for 500ms before capturing
    // const imageSrc = webcamRef.current.getScreenshot();

    // if (imageSrc) {
    //   try {
    //     const res = await axios.post(
    //       "http://localhost:8000/auth/proctoring/verify-face/",
    //       imageSrc,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     setStatus(res.data.status);
    //   } catch (error) {
    //     console.error("Error:", error);
    //     setStatus("Error sending image");
    //   }
    // }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
        videoConstraints={{ width: 320, height: 240, facingMode: "user" }}
      />
      <div style={{ margin: "10px" }}>
        <button onClick={captureAndSend}>Check Face</button>
      </div>
      <div>Status: {status}</div>
    </div>
  );
};

export default FaceTest;