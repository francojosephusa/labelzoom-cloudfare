'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PremiumCheckout() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      // Create a checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1ROmNXPqrY4hwEjUMOm56yxA',
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe checkout error:', error);
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Upgrade to Premium</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          <span>Unlimited scans</span>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          <span>Advanced ingredient analysis</span>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          <span>Priority OCR processing</span>
        </div>
        <div className="flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          <span>Ad-free experience</span>
        </div>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-full text-white font-semibold ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90'
        }`}
      >
        {loading ? 'Processing...' : 'Upgrade Now - $9.99/month'}
      </button>
      
      <p className="text-sm text-gray-500 mt-4 text-center">
        Secure payment powered by Stripe
      </p>
    </div>
  );
} 