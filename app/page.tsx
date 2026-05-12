'use client'

import { useState } from 'react'
import Navbar from '@/components/navbar'
import HeroSection from '@/components/hero-section'
import WorkflowSection from '@/components/workflow-section'
import EcosystemSection from '@/components/ecosystem-section'
import TrustSection from '@/components/trust-section'
import FinalCtaSection from '@/components/final-cta-section'

export default function Home() {
  return (
    <main className="bg-background text-foreground overflow-hidden">
      <Navbar />
      <HeroSection />
      <WorkflowSection />
      <EcosystemSection />
      <TrustSection />
      <FinalCtaSection />
    </main>
  )
}
