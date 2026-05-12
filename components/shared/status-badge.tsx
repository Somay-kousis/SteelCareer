'use client';

interface StatusBadgeProps {
  status:
    | 'active'
    | 'inactive'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'under-review'
    | 'completed'
    | 'scheduled';
  label?: string;
}

const statusConfig = {
  active: {
    bg: 'bg-accent/10',
    text: 'text-accent',
    label: 'Active',
  },
  inactive: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    label: 'Inactive',
  },
  pending: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-600',
    label: 'Pending',
  },
  approved: {
    bg: 'bg-accent/10',
    text: 'text-accent',
    label: 'Approved',
  },
  rejected: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    label: 'Rejected',
  },
  'under-review': {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    label: 'Under Review',
  },
  completed: {
    bg: 'bg-accent/10',
    text: 'text-accent',
    label: 'Completed',
  },
  scheduled: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    label: 'Scheduled',
  },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
    >
      {displayLabel}
    </span>
  );
}
