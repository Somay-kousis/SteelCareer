'use client';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'card' | 'line' | 'avatar' | 'form';
}

export function LoadingSkeleton({
  count = 1,
  type = 'card',
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (type === 'line') {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div
            key={i}
            className="h-4 bg-muted rounded-full animate-pulse"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              width: `${Math.random() * 40 + 60}%`,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'avatar') {
    return (
      <div className="flex items-center gap-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 bg-muted rounded-full animate-pulse"
            style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
          />
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="space-y-4">
        {items.map((_, i) => (
          <div key={i} className="space-y-2">
            <div
              className="h-4 bg-muted rounded animate-pulse"
              style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                width: '25%',
              }}
            />
            <div
              className="h-10 bg-muted rounded-lg animate-pulse"
              style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
            />
          </div>
        ))}
      </div>
    );
  }

  // Default: card type
  return (
    <div className="space-y-4">
      {items.map((_, i) => (
        <div
          key={i}
          className="border border-border/40 rounded-lg p-6 space-y-4 bg-card/20 animate-pulse"
          style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
        >
          <div
            className="h-6 bg-muted rounded animate-pulse"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              width: '40%',
            }}
          />
          <div
            className="h-4 bg-muted rounded animate-pulse"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              width: '100%',
            }}
          />
          <div
            className="h-4 bg-muted rounded animate-pulse"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              width: '80%',
            }}
          />
        </div>
      ))}
    </div>
  );
}
