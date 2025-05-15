import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`} {...props}>
      {children}
    </div>
  );
} 