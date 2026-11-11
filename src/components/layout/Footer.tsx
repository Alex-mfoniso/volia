import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/ui/Container';
import { COMPANY_DATA, NAVIGATION_LINKS, SERVICES_DETAILED } from '@/data/company';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-canvas-dark text-canvas border-t border-border-dark mt-auto" role="contentinfo">
      {/* Top Banner / Editorial Callout */}
      <div className="border-b border-border-dark/60 py-10 sm:py-12 lg:py-16">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start justify-between">
            <div className="lg:col-span-7 space-y-2">
              <span className="text-[10px] sm:text-[11px] font-sans tracking-architectural uppercase text-accent font-semibold block">
                Built-Environment Consultancy &bull; Nigeria
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-canvas leading-[1.15] max-w-2xl">
                Engineering precision, architectural integrity, and disciplined project governance.
              </h2>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between items-start lg:items-end space-y-4 sm:space-y-6 pt-2 lg:pt-0">
              <div className="text-left lg:text-right">
                <p className="text-xs text-ink-muted tracking-wide font-light max-w-sm">
                  {COMPANY_DATA.legalName} delivers integrated technical counsel and commercial precision across Nigerian capital works.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center space-x-2 text-xs font-sans tracking-architectural uppercase text-accent hover:text-white transition-colors duration-200 group border-b border-accent pb-1 min-h-[38px]"
              >
                <span>Direct Institutional Inquiries</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Matrix */}
      <div className="py-12 sm:py-14 lg:py-16">
        <Container size="wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">
            {/* Column 1: Institutional Identification */}
            <div className="space-y-3.5 sm:space-y-4">
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-tight text-white font-semibold">
                  VOLIA<span className="text-accent">.</span>
                </span>
                <span className="text-[9px] tracking-architectural font-sans uppercase text-accent mt-0.5 font-medium">
                  {COMPANY_DATA.descriptor || 'ENGINEERING & CONSULTANCY'}
                </span>
                <span className="text-[10px] tracking-wider font-mono text-ink-muted mt-1">
                  {COMPANY_DATA.legalName}
                </span>
              </div>
              <p className="text-xs text-ink-muted font-light leading-relaxed">
                Registered entity providing professional engineering consultancy, architectural advisory, and quantity surveying solutions for corporate and institutional developments in Nigeria.
              </p>
              <div className="pt-1 sm:pt-2">
                <span className="inline-block text-[9px] sm:text-[10px] font-sans tracking-widest uppercase px-2.5 py-1 border border-border-dark text-ink-muted">
                  CAC Registered &bull; Est. 1993*
                </span>
              </div>
            </div>

            {/* Column 2: Core Services */}
            <div className="space-y-3.5 sm:space-y-4">
              <h3 className="text-xs font-sans tracking-architectural uppercase text-white font-medium">
                Services
              </h3>
              <ul className="space-y-2 text-xs text-ink-muted font-light">
                {SERVICES_DETAILED.map((service) => (
                  <li key={service.id}>
                    <Link
                      to={`/services#${service.id}`}
                      className="hover:text-canvas transition-colors duration-200 flex items-center space-x-2 py-0.5 min-h-[28px]"
                    >
                      <span className="text-[10px] font-mono text-accent">{service.number}</span>
                      <span>{service.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Platform Tools & Index */}
            <div className="space-y-3.5 sm:space-y-4">
              <h3 className="text-xs font-sans tracking-architectural uppercase text-white font-medium">
                Platform &amp; Navigation
              </h3>
              <ul className="space-y-2 text-xs text-ink-muted font-light">
                {NAVIGATION_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="hover:text-canvas transition-colors duration-200 block py-0.5 min-h-[24px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/project-brief"
                    className="text-accent hover:text-white transition-colors duration-200 block py-0.5 min-h-[24px] font-medium"
                  >
                    Project Brief Builder &rarr;
                  </Link>
                </li>
                <li>
                  <Link
                    to="/company-profile"
                    className="hover:text-canvas transition-colors duration-200 block py-0.5 min-h-[24px]"
                  >
                    Capability Statement (PDF)
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/consultation"
                    className="hover:text-canvas transition-colors duration-200 block py-0.5 min-h-[24px]"
                  >
                    Service Diagnostic Tool
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Verification Notice */}
            <div className="space-y-3.5 sm:space-y-4">
              <h3 className="text-xs font-sans tracking-architectural uppercase text-white font-medium">
                Contact &bull; Provisional
              </h3>
              <div className="space-y-3 text-xs text-ink-muted font-light">
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-muted/60 block">
                    Electronic Mail
                  </span>
                  <a
                    href={`mailto:${COMPANY_DATA.contactPlaceholder.email}`}
                    className="text-canvas hover:text-accent transition-colors duration-200 block truncate pt-0.5"
                  >
                    {COMPANY_DATA.contactPlaceholder.email}
                  </a>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-muted/60 block">
                    Telephone
                  </span>
                  <span className="text-canvas block pt-0.5">{COMPANY_DATA.contactPlaceholder.phone}</span>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-muted/60 block">
                    Jurisdiction
                  </span>
                  <span className="text-canvas block pt-0.5">Federal Republic of Nigeria</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Baseline Bar / Legal & Compliance */}
      <div className="border-t border-border-dark/60 py-5 sm:py-6 text-xs text-ink-muted/70">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <p className="text-[10px] sm:text-[11px] font-light">
              &copy; {currentYear} {COMPANY_DATA.legalName}. All rights reserved. *Reported 1993 incorporation subject to management verification.
            </p>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-ink-muted/60">
              Commercial Prototype &bull; Phase 4 Interactive Platform
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
};
