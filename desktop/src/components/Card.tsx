import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  noPadding?: boolean;
}

export default function Card({ children, className = '', title, noPadding = false }: CardProps) {
  return (
    <div className={`bg-card/50 border border-border backdrop-blur-sm rounded-xl overflow-hidden shadow-inner-soft ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-border/50 bg-white/5">
          <h3 className="font-semibold text-text text-sm tracking-wide">{title}</h3>
        </div>
      )}
      <div className={`${noPadding ? '' : 'p-5'}`}>
        {children}
      </div>
    </div>
  );
}
