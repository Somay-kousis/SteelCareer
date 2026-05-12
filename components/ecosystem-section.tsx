'use client'

import Link from 'next/link'

export default function EcosystemSection() {
  const ecosystemItems = [
    {
      title: 'For Job Seekers',
      description: 'Personal guidance through every step. Real connections with providers who invest in your success.',
      icon: '✦',
      accent: true,
    },
    {
      title: 'For Providers',
      description: 'Access thoughtfully vetted candidates. Build lasting relationships with people committed to growth.',
      icon: '◆',
      accent: false,
    },
    {
      title: 'Operations',
      description: 'Manage relationships, track progress, and coordinate seamlessly across your entire network.',
      icon: '●',
      accent: false,
    },
  ]

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light tracking-tight mb-4">
            Three perspectives, <span className="text-accent">one platform</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Designed for different roles. United by shared values of trust and human connection.
          </p>
        </div>

        {/* Ecosystem cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {ecosystemItems.map((item, index) => (
            <Link
              key={index}
              href="#"
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 hover:bg-card/70 transition-all duration-500 p-8"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/40 to-transparent" />

              <div className="relative z-10 space-y-6">
                {/* Icon and title */}
                <div className="space-y-3">
                  <div
                    className={`text-4xl font-light ${
                      item.accent ? 'text-accent' : 'text-muted-foreground'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-light">{item.title}</h3>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* Arrow indicator */}
                <div className="flex items-center gap-2 pt-4 text-accent text-sm font-light group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              {/* Hover border glow */}
              <div className="absolute inset-0 rounded-2xl border border-accent/0 group-hover:border-accent/20 transition-colors duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
