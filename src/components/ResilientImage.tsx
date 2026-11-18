import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle?: string;
  fallbackGradient?: string;
  className?: string;
  containerClassName?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackTitle,
  fallbackGradient = 'from-zinc-800 via-zinc-700 to-stone-800',
  className = 'w-full h-full object-cover',
  containerClassName = 'relative overflow-hidden bg-zinc-100',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={containerClassName}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setHasError(true)}
          className={className}
        />
      ) : (
        <div
          className={`w-full h-full min-h-[240px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br ${fallbackGradient} text-zinc-100`}
        >
          <ImageIcon className="w-8 h-8 mb-3 opacity-70" />
          <p className="text-sm font-medium tracking-tight max-w-xs">
            {fallbackTitle || alt}
          </p>
        </div>
      )}
    </div>
  );
};
