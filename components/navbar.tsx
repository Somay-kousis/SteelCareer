'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="#" className="text-xl font-light tracking-tight">
          <span className="text-foreground">steele</span>
          <span className="text-accent">career</span>
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-6">
          <Link
            href="/auth/signin"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link href="/auth/signup">
            <Button
              size="sm"
              className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create account
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
