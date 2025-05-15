'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserButton from '../auth/UserButton';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/history', label: 'History', icon: '📂' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center py-3">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center space-y-1 ${
                  isActive
                    ? 'text-blue-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-xs">{label}</span>
              </Link>
            );
          })}
          <div className="flex flex-col items-center space-y-1">
            <UserButton />
            <span className="text-xs text-gray-500">Profile</span>
          </div>
        </div>
      </div>
    </nav>
  );
} 