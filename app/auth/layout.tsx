'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.15] via-transparent to-transparent blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-tl from-accent/[0.08] via-transparent to-transparent blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {children}
      </div>
    </div>
  );
}
