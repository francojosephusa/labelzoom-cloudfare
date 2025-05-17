'use client'

import { useRef, useState, useCallback } from 'react'
import { createWorker } from 'tesseract.js'
import { Button } from './ui/Button'

export function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState('')

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
  }, [])

  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Process image with Tesseract
    setIsProcessing(true)
    try {
      const worker = await createWorker()
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
      const { data: { text } } = await worker.recognize(canvas)
      setResult(text)
      await worker.terminate()
    } catch (error) {
      console.error('OCR Error:', error)
    }
    setIsProcessing(false)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-2">
        {!isStreaming ? (
          <Button onClick={startCamera}>Start Camera</Button>
        ) : (
          <>
            <Button onClick={captureImage} isLoading={isProcessing}>
              Capture & Read
            </Button>
            <Button variant="secondary" onClick={stopCamera}>
              Stop Camera
            </Button>
          </>
        )}
      </div>

      {result && (
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow">
          <h3 className="font-medium text-gray-900">Detected Text:</h3>
          <p className="mt-2 text-gray-600 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  )
} 