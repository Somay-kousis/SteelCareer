'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex flex-col items-center justify-center">
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/3 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/2 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Main headline */}
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-light tracking-tight text-balance">
            Guidance that feels
            <br />
            <span className="text-accent font-normal">personal, never robotic.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            We guide careers personally, not algorithmically.
          </p>

          <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A structured international hiring platform built around trust, introductions, and human
            coordination.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/auth/signup">
            <Button
              size="lg"
              className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
            >
              Begin with us
            </Button>
          </Link>
          <button className="rounded-full px-8 py-2.5 border border-border hover:bg-card transition-all text-lg font-medium">
            Explore workflow
          </button>
        </div>

        {/* Dashboard visual hint */}
        <div className="pt-12">
          <div className="relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-8 overflow-hidden group">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Simplified dashboard visual */}
            <div className="relative space-y-4">
              <div className="flex gap-2">
                <div className="h-2 w-2 bg-accent rounded-full" />
                <div className="h-2 flex-1 bg-muted rounded" />
                <div className="h-2 w-16 bg-muted rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted/50 rounded w-3/4" />
                <div className="h-3 bg-muted/30 rounded w-1/2" />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-muted/20 rounded border border-border/20" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
