'use client';

import { UserButton as ClerkUserButton } from '@clerk/nextjs';

export default function UserButton() {
  return (
    <ClerkUserButton 
      appearance={{
        elements: {
          userButtonAvatarBox: 'w-10 h-10',
        },
      }}
      afterSignOutUrl="/"
    />
  );
} 