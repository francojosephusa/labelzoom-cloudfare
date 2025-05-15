'use client'

import { useEffect } from 'react'
import { Button } from './ui/Button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-[400px] flex items-center justify-center px-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Please try again.
        </p>
        <div className="space-x-4">
          <Button onClick={() => reset()}>Try again</Button>
          <Button
            variant="secondary"
            onClick={() => window.location.href = '/'}
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
} 