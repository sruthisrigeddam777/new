// /* global cv */
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";

const ProctoringWebcam = ({ webcamRef }) => {
  //const webcamRef = useRef(null);
  const [status, setStatus] = useState("🔴 Initializing...");



  useEffect(() => {
    const waitForCV = setInterval(() => {
      if (window.cv && window.cv.Mat) {
        clearInterval(waitForCV);
        // Now call your OpenCV logic
        initOpenCVStuff(); // <-- your function with cv logic
      }
    }, 100);
    return () => clearInterval(waitForCV);
  }, []);


  const initOpenCVStuff = () => {
    //const video = webcamRef.current.video;
    // const cap = new window.cv.VideoCapture(video);
    // const frame = new window.cv.Mat(video.height, video.width, window.cv.CV_8UC4);

    // Add more OpenCV logic here...
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right:"1rem",
        //bottom: "20px",
        //right: "20px",
        zIndex: 1000,
        border: "2px solid #ccc",
        borderRadius: "10px",
        overflow: "hidden",
        width: "320px",
        height: "240px",
        backgroundColor: "#000",
        background: "#000",
        boxShadow: "0px 0px 12px rgba(0, 191, 255, 0.6)",
      }}
    >
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        //width={720}
        //height={405}
        //style={{ border: "2px solid green" }}
        onUserMedia={() =>{
          console.log("Webcam feed started");
        }}
        //videoConstraints={{ facingMode: "user" }}
        videoConstraints={{
          width: 320,
          heigth: 240,
          facingMode: "user",
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderBottom: "2px solid green",
         }}
      />
      <div
        style={{
          textAlign: "center",
          padding: "8px",
          backgroundColor: "#111",
          color: status.includes("🟢") ? "#00FF00" : "#FF4C4C",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        {status}

      </div>
    </div>
  );
};

export default ProctoringWebcam;