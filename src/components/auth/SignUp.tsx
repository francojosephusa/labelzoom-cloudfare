'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-500 hover:bg-blue-600 text-sm normal-case',
            card: 'bg-white shadow-xl rounded-xl',
          },
        }}
        afterSignUpUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  );
} 