import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'LabelZoom - Read Small Text with Ease',
  description: 'A mobile app that helps you read small text on product labels using OCR technology.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="min-h-screen bg-gray-50">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
