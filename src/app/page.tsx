'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Camera from '../components/features/camera/Camera';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';

export default function HomePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    language: string;
  } | null>(null);

  const handleCapture = async (imageData: string) => {
    try {
      setIsProcessing(true);
      setError(null);

      // TODO: Implement OCR processing
      // For now, we'll simulate OCR processing
      const response = await fetch('/api/scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageData,
          text_content: 'Sample text from OCR',
          language: 'en',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      const data = await response.json();
      setResult({
        text: data.text_content,
        language: data.language,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: string) => {
    setError(error);
  };

  const handleViewHistory = () => {
    router.push('/history');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          LabelZoom
        </h1>

        {!result && (
          <Camera
            onCapture={handleCapture}
            onError={handleError}
          />
        )}

        {error && (
          <Card className="mt-4 bg-red-50 border border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        {isProcessing && (
          <Card className="mt-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              <p>Processing image...</p>
            </div>
          </Card>
        )}

        {result && (
          <Card className="mt-4">
            <h2 className="text-xl font-semibold mb-4">Scan Result</h2>
            <p className="whitespace-pre-wrap mb-4">{result.text}</p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setResult(null)}
              >
                New Scan
              </Button>
              <Button
                onClick={handleViewHistory}
              >
                View History
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
} 