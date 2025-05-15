'use client';

import { useRef, useState, useEffect } from 'react';

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      // Here you would send the imageData to your OCR service
      console.log('Image captured:', imageData.substring(0, 100) + '...');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <button
          onClick={startCamera}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Enable Camera
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full aspect-[3/4] bg-gray-900 rounded-lg"
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
        <button
          onClick={captureImage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Capture
        </button>
        <button
          onClick={stopCamera}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Stop
        </button>
      </div>
    </div>
  );
} 