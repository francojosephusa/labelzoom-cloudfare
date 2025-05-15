'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Button from '../../shared/Button';
import Card from '../../shared/Card';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PremiumFeature {
  icon: string;
  title: string;
  description: string;
}

const premiumFeatures: PremiumFeature[] = [
  {
    icon: '🔍',
    title: 'Enhanced OCR',
    description: 'Higher accuracy text recognition with support for more languages',
  },
  {
    icon: '💾',
    title: 'Unlimited History',
    description: 'Save and access all your previous scans',
  },
  {
    icon: '🎨',
    title: 'Advanced Customization',
    description: 'Custom themes and additional accessibility options',
  },
];

export default function PremiumCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Upgrade to Premium
      </h1>
      
      <Card className="mb-8">
        <div className="text-center mb-6">
          <span className="text-3xl font-bold">$4.99</span>
          <span className="text-gray-600">/month</span>
        </div>

        <div className="space-y-6 mb-8">
          {premiumFeatures.map((feature) => (
            <div key={feature.title} className="flex items-start space-x-3">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Processing...' : 'Subscribe Now'}
        </Button>
      </Card>

      <p className="text-center text-sm text-gray-500">
        Cancel anytime. 30-day money-back guarantee.
      </p>
    </div>
  );
} 