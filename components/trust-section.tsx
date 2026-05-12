'use client'

export default function TrustSection() {
  const trustPoints = [
    {
      title: 'Profile Review',
      description: 'Thoughtful evaluation of your background and goals by real people.',
    },
    {
      title: 'Structured Milestones',
      description: 'Clear checkpoints and progress tracking throughout your journey.',
    },
    {
      title: 'International Coordination',
      description: 'Seamless cross-border communication and timezone-aware scheduling.',
    },
    {
      title: 'Guided Onboarding',
      description: 'Step-by-step support to ensure smooth transitions and success.',
    },
    {
      title: 'Human Oversight',
      description: 'Real people managing relationships, not algorithms making decisions.',
    },
    {
      title: 'Continuous Support',
      description: 'Ongoing guidance and adjustments based on your evolving needs.',
    },
  ]

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light tracking-tight mb-4">
            Built on <span className="text-accent">trust</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            What makes Steelcareer different is human judgment at every step.
          </p>
        </div>

        {/* Trust points grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((point, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl border border-border/40 hover:border-accent/40 bg-card/30 hover:bg-card/50 transition-all duration-300"
            >
              {/* Top accent accent */}
              <div className="absolute top-0 left-0 w-2 h-8 bg-accent rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />

              <div className="relative z-10 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-4 bg-accent rounded-full mt-1" />
                  <h3 className="text-base font-light">{point.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-4 leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
