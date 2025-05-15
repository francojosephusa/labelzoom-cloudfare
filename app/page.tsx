import { auth } from '@clerk/nextjs'
import { Camera } from './components/Camera'

export default async function Home() {
  const { userId } = auth()
  const isAuthenticated = !!userId

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">
          LabelZoom
        </h1>
        
        {isAuthenticated ? (
          <Camera />
        ) : (
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">
              Please sign in to use LabelZoom
            </p>
            <a
              href="/sign-in"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Sign In
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
