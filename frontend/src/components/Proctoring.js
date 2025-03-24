// import React, { useEffect, useRef, useState } from "react";
// import * as faceapi from "face-api.js";

// const Proctoring = ({ user, onExamEnd }) => {
//   const videoRef = useRef(null);
//   const [stream, setStream] = useState(null);

//   useEffect(() => {
//     startVideo();
//     loadModels();

//     return () => {
//       stopVideo();
//     };
//   }, []);

//   const startVideo = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         setStream(mediaStream);
//       }
//     } catch (error) {
//       console.error("Error accessing webcam:", error);
//     }
//   };

//   const stopVideo = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//   };

//   const loadModels = async () => {
//     try {
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@models"),
//         faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@models"),
//         faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@models"),
//         faceapi.nets.tinyYolov2.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@models"),
//         faceapi.nets.ssdMobilenetv1.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@models"),
//       ]);
//       console.log("Models loaded successfully from CDN");
//     } catch (error) {
//       console.error("Error loading models:", error);
//     }
//   };

//   useEffect(() => {
//     if (!videoRef.current) return;

//     const detectCheating = async () => {
//       const detections = await faceapi.detectAllFaces(
//         videoRef.current,
//         new faceapi.TinyFaceDetectorOptions()
//       );

//       if (detections.length === 0) {
//         console.warn("No face detected - Possible malpractice");
//       }
//     };

//     const interval = setInterval(detectCheating, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     return () => stopVideo();
//   }, [onExamEnd]);

//   return (
//     <div>
//       <h3>Proctoring Active</h3>
//       <video ref={videoRef} autoPlay playsInline width="320" height="240"></video>
//     </div>
//   );
// };

// export default Proctoring;



// import React, { useEffect, useRef, useState } from "react";
// import * as faceapi from "face-api.js";

// const Proctoring = ({ user, onExamEnd }) => {
//   const videoRef = useRef(null);
//   const [stream, setStream] = useState(null);

//   useEffect(() => {
//     startVideo();
//     loadModels();

//     return () => {
//       stopVideo();
//     };
//   }, []);

//   const startVideo = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         setStream(mediaStream);
//       }
//     } catch (error) {
//       console.error("Error accessing webcam:", error);
//     }
//   };

//   const stopVideo = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//   };

//   const loadModels = async () => {
//     await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
//     await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
//   };

//   useEffect(() => {
//     if (!videoRef.current) return;

//     const detectCheating = async () => {
//       const detections = await faceapi.detectAllFaces(
//         videoRef.current,
//         new faceapi.TinyFaceDetectorOptions()
//       );

//       if (detections.length === 0) {
//         console.warn("No face detected - Possible malpractice");
//       }
//     };

//     const interval = setInterval(detectCheating, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     return () => stopVideo();
//   }, [onExamEnd]);

//   return (
//     <div>
//       <h3>Proctoring Active</h3>
//       <video ref={videoRef} autoPlay playsInline width="320" height="240"></video>
//     </div>
//   );
// };

// export default Proctoring;


import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import cv from "@techstark/opencv-js";

const backendUrl = "http://127.0.0.1:8000/auth"; // Django backend URL

const Proctoring = ({ user, onExamEnd = () => {} }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [violations, setViolations] = useState(0);
  const MAX_VIOLATIONS = 3; // Exam ends after 3 violations

  useEffect(() => {
    if (!cv || !cv.imread) {
      console.error("OpenCV is not loaded properly!");
    }
  }, []);

  useEffect(() => {
    startVideo();
    loadModels();
    document.addEventListener("visibilitychange", handleTabSwitch);

    return () => {
      document.removeEventListener("visibilitychange", handleTabSwitch);
    };
  }, []);

  // Start webcam feed
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 320, height: 240 } }) // Reduced video size
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  // Load face-api.js models
  const loadModels = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

    detectCheating();
    setInterval(detectCheating, 5000);
  };

  // Detect cheating
  const detectCheating = async () => {
    if (!videoRef.current) return;

    const detections = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks();

    if (detections.length === 0) {
      handleMalpractice("No face detected");
    } else if (detections.length > 1) {
      handleMalpractice("Multiple faces detected");
    } else {
      detectEyeMovement(detections[0].landmarks);
      detectMobileInFrame();
    }
  };

  // Detect if student is looking away
  const detectEyeMovement = (landmarks) => {
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const avgEyeX = (leftEye[0].x + rightEye[0].x) / 2;

    if (avgEyeX < 100 || avgEyeX > 300) {
      handleMalpractice("Looking away from screen");
    }
  };

  // Handle tab switching detection
  const handleTabSwitch = () => {
    if (document.hidden) {
      handleMalpractice("Tab switch detected");
    }
  };

  // Detect mobile phone using OpenCV
  const detectMobileInFrame = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const src = cv.imread(canvas);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

    const edges = new cv.Mat();
    cv.Canny(gray, edges, 50, 150, 3, false);

    let mobileDetected = false;
    let whitePixels = 0;
    for (let i = 0; i < edges.data.length; i++) {
      if (edges.data[i] > 200) {
        whitePixels++;
      }
    }

    if (whitePixels > 5000) {
      mobileDetected = true;
    }

    if (mobileDetected) {
      handleMalpractice("Possible mobile detected in frame");
    }

    src.delete();
    gray.delete();
    edges.delete();
  };

  // Handle malpractice
  const handleMalpractice = (reason) => {
    console.warn("Violation:", reason);
    setViolations((prev) => {
      const newViolations = prev + 1;
      if (newViolations >= MAX_VIOLATIONS) {
        alert(`🚨 Exam Ended: You are disqualified due to ${reason}!`);
        logViolation(reason);
        onExamEnd();
        navigate("/exam-disqualified");
      } else {
        logViolation(reason);
      }
      return newViolations;
    });
  };

  // Log violations to backend
  const logViolation = async (action) => {
    try {
      await fetch(`${backendUrl}/proctoring/log_violation/`, {
        method: "POST",
        body: JSON.stringify({ student: user.id, action }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error logging violation:", error);
    }
  };

  return (
    <div>
      <h3>Proctoring Active - Violations: {violations} / {MAX_VIOLATIONS}</h3>
      <video ref={videoRef} autoPlay playsInline style={{ width: "320px", height: "240px" }}></video>
    </div>
  );
};

export default Proctoring;
