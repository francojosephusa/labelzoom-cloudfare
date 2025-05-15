'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/shared/Card';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="text-center max-w-md">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-4">
          Welcome to LabelZoom Premium!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for subscribing. You now have access to all premium features.
          You'll be redirected to the home page in a few seconds.
        </p>
        <div className="text-sm text-gray-500">
          If you're not redirected, <button onClick={() => router.push('/')} className="text-blue-500 hover:underline">click here</button>
        </div>
      </Card>
    </div>
  );
} 