'use client'

export default function WorkflowSection() {
  const steps = [
    {
      number: '01',
      title: 'Submit Profile',
      description: 'Share your background, experience, and career aspirations in a structured format.',
    },
    {
      number: '02',
      title: 'Structured Review',
      description: 'Our team carefully evaluates your profile with thoughtful consideration.',
    },
    {
      number: '03',
      title: 'Thoughtful Matching',
      description: 'We connect you with providers that align with your goals and values.',
    },
    {
      number: '04',
      title: 'Coordinated Meetings',
      description: 'Personal introductions facilitated with clear communication and timing.',
    },
    {
      number: '05',
      title: 'Guided Progress',
      description: 'Track milestones and stay supported throughout your journey.',
    },
  ]

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light tracking-tight mb-4">
            The <span className="text-accent">concierge workflow</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A carefully designed process that respects both your time and expertise.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connection line */}
              {index !== steps.length - 1 && (
                <div className="absolute left-8 top-20 w-1 h-12 bg-gradient-to-b from-accent/40 to-transparent" />
              )}

              <div className="flex gap-8 items-start">
                {/* Step number */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full border-2 border-accent/40 flex items-center justify-center group-hover:border-accent transition-colors">
                    <span className="text-sm font-light text-accent">{step.number}</span>
                  </div>
                </div>

                {/* Step content */}
                <div className="flex-1 pt-3 group-hover:translate-x-2 transition-transform duration-300">
                  <h3 className="text-xl font-light mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
