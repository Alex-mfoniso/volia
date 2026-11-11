import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <AppLayout>
      <SEO
        title="404 — Spatial Plan Not Found"
        description="The requested architectural route or document index does not exist in the VOLIA archive."
        canonicalPath="/404"
      />

      <section className="py-28 sm:py-36 lg:py-44 border-b border-border bg-canvas relative overflow-hidden">
        <Container size="wide">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Architectural Coordinates Badge */}
            <div className="inline-flex items-center space-x-2 text-accent border border-border px-3.5 py-1.5 bg-canvas-surface text-xs font-mono tracking-widest uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>DISPLACED COORDINATES // ERROR 404</span>
            </div>

            {/* Editorial Title */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-ink leading-tight">
                Spatial plan not found.
              </h1>
              <p className="text-sm sm:text-base text-ink-muted font-light leading-relaxed max-w-xl mx-auto font-sans">
                The requested URL does not match any verified route, project archive, or statutory publication within the VOLIA NIG LTD digital register.
              </p>
            </div>

            {/* Recovery Action Suite */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href="/"
                variant="primary"
                size="md"
                leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                className="w-full sm:w-auto min-h-[44px]"
              >
                Return to Homepage
              </Button>
              <Button
                href="/services"
                variant="secondary"
                size="md"
                className="w-full sm:w-auto min-h-[44px]"
              >
                Examine Practice Disciplines
              </Button>
            </div>

            <div className="pt-8 border-t border-border/80 text-[10px] font-mono text-ink-muted/70 uppercase">
              VOLIA NIG LTD &bull; ARCHITECTURAL ROUTING SYSTEM
            </div>
          </div>
        </Container>
      </section>
    </AppLayout>
  );
};
