import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from './ui/Button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PremiumFeature {
  title: string
  description: string
  icon: string
}

const features: PremiumFeature[] = [
  {
    title: 'Unlimited Scans',
    description: 'Scan as many labels as you need without restrictions',
    icon: '🔄'
  },
  {
    title: 'Batch Processing',
    description: 'Scan multiple labels at once and save time',
    icon: '📚'
  },
  {
    title: 'Export & Share',
    description: 'Export your scans in various formats and share with others',
    icon: '📤'
  },
  {
    title: 'Advanced OCR',
    description: 'Enhanced text recognition with support for multiple languages',
    icon: '🔍'
  }
]

export function PremiumCheckout() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (!stripe) {
        throw new Error('Stripe failed to load')
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })
      
      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upgrade to Premium
        </h2>
        <p className="text-lg text-gray-600">
          Get access to advanced features and unlimited scans
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-6 border border-gray-200 rounded-lg"
          >
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="mb-8">
          <div className="text-5xl font-bold text-gray-900 mb-4">
            $9.99
            <span className="text-xl text-gray-600">/month</span>
          </div>
          <p className="text-gray-600">Cancel anytime</p>
        </div>

        <Button
          onClick={handleSubscribe}
          isLoading={isLoading}
          size="lg"
          className="w-full sm:w-auto"
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  )
} 