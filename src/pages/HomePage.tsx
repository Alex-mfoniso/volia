import React, { Suspense } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SEO } from '@/components/common/SEO';
import {
  HeroSection,
  IntroductionSection,
  ServicesSection,
  PhilosophySection,
  ProjectsSection,
  CareersSection,
  ClosingCTASection,
} from '@/sections';
import { ModelLoadingState } from '@/components/three/ModelLoadingState';

// Performance-optimized dynamic imports for heavy 3D canvases
const BlueprintScene = React.lazy(() => import('@/components/three/BlueprintScene'));
const ExplodedStructure = React.lazy(() => import('@/components/three/ExplodedStructure'));

export const HomePage: React.FC = () => {
  return (
    <AppLayout>
      <SEO
        title="Engineering &amp; Built-Environment Consultancy"
        description="VOLIA NIG LTD is a multidisciplinary Nigerian consultancy delivering integrated engineering services, architectural consultancy, and quantity surveying with precision."
        canonicalPath="/"
      />

      {/* SECTION A: HERO (With 3D Contemporary Pavilion Centerpiece & Photo Switcher) */}
      <HeroSection />

      {/* SECTION B: COMPANY INTRODUCTION */}
      <IntroductionSection />

      {/* FEATURE: BLUEPRINT TO ARCHITECTURE TRANSFORMATION */}
      <Suspense
        fallback={
          <div className="py-20 bg-canvas-surface/40 border-b border-border">
            <ModelLoadingState
              message="Loading Architectural Metamorphosis..."
              subtext="Preparing 5-stage geometric vector pipeline"
            />
          </div>
        }
      >
        <BlueprintScene />
      </Suspense>

      {/* SECTION C: SERVICES (Engineering, Architecture, Quantity Surveying) */}
      <ServicesSection />

      {/* FEATURE: 3D EXPLODED STRUCTURAL VIEW */}
      <Suspense
        fallback={
          <div className="py-20 bg-canvas border-b border-border">
            <ModelLoadingState
              message="Loading 3D Exploded Structural Model..."
              subtext="Mounting 6-layer architectural assembly"
            />
          </div>
        }
      >
        <ExplodedStructure />
      </Suspense>

      {/* SECTION D: APPROACH AND PHILOSOPHY (01. Understand, 02. Plan, 03. Develop, 04. Deliver) */}
      <PhilosophySection />

      {/* SECTION E: PROJECTS PREVIEW */}
      <ProjectsSection />

      {/* SECTION F: CAREERS PREVIEW (Build your career with VOLIA -> /careers) */}
      <CareersSection />

      {/* SECTION G: CLOSING CONTACT CTA (Have a project in mind? -> /contact) */}
      <ClosingCTASection />
    </AppLayout>
  );
};

export default HomePage;
