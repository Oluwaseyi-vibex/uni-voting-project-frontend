import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import toast from "react-hot-toast";

const FaceAuth = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(
          "/models/ssd_mobilenetv1"
        );
        await faceapi.nets.faceLandmark68Net.loadFromUri(
          "/models/face_landmark_68"
        );
        await faceapi.nets.faceRecognitionNet.loadFromUri(
          "/models/face_recognition"
        );
        setLoading(false);
      } catch (err) {
        console.error("Error loading models:", err);
        setError("Failed to load face models.");
      }
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setError(""); // Clear previous errors
      })
      .catch(() => setError("Camera access denied!"));
  };

  const captureFace = async () => {
    try {
      if (!videoRef.current) return;

      // Clear previous error messages
      setError("");

      // Wait for the face to be detected properly
      await new Promise((resolve) => setTimeout(resolve, 500));

      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setError("No face detected. Please try again.");
        return;
      }

      const descriptorArray = Array.from(detections.descriptor);
      console.log("Captured descriptor:", descriptorArray);

      // Send descriptor back to the parent component
      if (onCapture) {
        onCapture(descriptorArray);
        toast.success("Face captured successfully!");
      }
    } catch (error) {
      console.error("Face capture error:", error);
      setError("Face capture failed. Please try again.");
    }
  };

  return (
    <div>
      {loading && <p>Loading models...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <video ref={videoRef} autoPlay width="300" />
      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={startVideo}
          className="bg-black w-fit p-3 font-light text-white"
        >
          Start Camera
        </button>
        <button
          onClick={captureFace}
          className="bg-black w-fit p-3 font-light text-white"
        >
          Capture Face
        </button>
      </div>
    </div>
  );
};

export default FaceAuth;
