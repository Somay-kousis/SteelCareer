'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function FinalCtaSection() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Content */}
        <div className="text-center space-y-8">
          {/* Main CTA headline */}
          <h2 className="text-5xl md:text-6xl font-light tracking-tight">
            Start with clarity—
            <br />
            <span className="text-accent font-normal">stay human as you scale.</span>
          </h2>

          {/* Supporting text */}
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Your career is too important to leave to algorithms. Join a platform that treats hiring
            the way it should be: thoughtful, human, and genuinely committed to your success.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all font-light"
              >
                Create account
              </Button>
            </Link>
            <button className="rounded-full px-8 py-3 border border-border hover:bg-card/50 transition-all text-lg font-light">
              Explore platform
            </button>
          </div>

          {/* Footer links */}
          <div className="pt-12 border-t border-border/30">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
