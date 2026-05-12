'use client';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressIndicator({
  current,
  total,
  label,
  showPercentage = true,
}: ProgressIndicatorProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-light text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {current && total && (
        <p className="text-xs text-muted-foreground">
          {current} of {total} complete
        </p>
      )}
    </div>
  );
}
