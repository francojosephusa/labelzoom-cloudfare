'use client';

import { useRef, useState, useCallback } from 'react';
import Button from '../../shared/Button';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onError: (error: string) => void;
}

export default function Camera({ onCapture, onError }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCameraReady, setCameraReady] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setCameraReady(true);
      }
    } catch (error) {
      onError('Failed to access camera. Please ensure camera permissions are granted.');
      console.error('Camera access error:', error);
    }
  }, [onError]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      setCameraReady(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to base64 image
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageData);
        
        // Stop camera after capture
        stopCamera();
      }
    }
  }, [onCapture, stopCamera]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          onCanPlay={() => setCameraReady(true)}
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <Button
              onClick={startCamera}
              variant="primary"
              size="lg"
              className="flex items-center space-x-2"
            >
              <span>📷</span>
              <span>Start Camera</span>
            </Button>
          </div>
        )}

        {isStreaming && isCameraReady && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <Button
              onClick={captureImage}
              variant="primary"
              size="lg"
              className="shadow-lg"
            >
              Capture
            </Button>
            <Button
              onClick={stopCamera}
              variant="secondary"
              size="lg"
              className="shadow-lg"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        Position the text label within the frame and ensure good lighting for best results
      </p>
    </div>
  );
} 