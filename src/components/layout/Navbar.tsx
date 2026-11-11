import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { NAVIGATION_LINKS, COMPANY_DATA } from '@/data/company';
import { cn } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const isHome = location.pathname === '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-architectural',
        isScrolled
          ? 'bg-canvas/95 backdrop-blur-md border-b border-border shadow-[0_1px_4px_0_rgba(37,37,31,0.03)] py-3 sm:py-3.5'
          : isHome
          ? 'bg-canvas/90 sm:bg-canvas/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none border-b border-border/40 py-4 sm:py-5 lg:py-6'
          : 'bg-canvas/95 backdrop-blur-md border-b border-border py-3.5 sm:py-4 lg:py-5'
      )}
      role="banner"
    >
      <Container size="wide">
        <div className="flex items-center justify-between">
          {/* Brand Wordmark & Descriptor */}
          <Link
            to="/"
            className="group flex flex-col items-start focus-visible:outline-none"
            aria-label={`${COMPANY_DATA.legalName} Homepage`}
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-ink font-semibold leading-none group-hover:text-accent transition-colors duration-300">
              VOLIA<span className="text-accent">.</span>
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-widest sm:tracking-architectural font-sans uppercase text-ink-muted mt-0.5 sm:mt-1 leading-none font-medium">
              {COMPANY_DATA.descriptor || 'ENGINEERING & CONSULTANCY'}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center space-x-8 xl:space-x-11"
            aria-label="Primary Navigation"
          >
            {NAVIGATION_LINKS.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={cn(
                    'text-xs font-sans tracking-architectural uppercase relative py-1 transition-colors duration-200 group focus-visible:outline-none',
                    isActive ? 'text-ink font-semibold' : 'text-ink/80 hover:text-ink'
                  )}
                >
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 h-[1.5px] bg-accent transition-all duration-300',
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop Contact Action & Coordinates Status */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-5">
            <Link
              to="/project-brief"
              className="text-[11px] font-sans tracking-architectural uppercase text-accent hover:text-ink transition-colors font-medium"
            >
              Project Brief
            </Link>
            <span className="text-[10px] font-mono tracking-widest text-ink-muted uppercase border-r border-border pr-4">
              NG &bull; 09&deg;04&prime;N
            </span>
            <Button
              href="/contact"
              variant="primary"
              size="sm"
              withArrow
              className="text-[11px]"
            >
              Contact
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ink hover:text-accent focus-visible:outline-none border border-border bg-canvas/90 active:bg-canvas-surface transition-colors"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 stroke-[1.5]" />
              ) : (
                <Menu className="w-5 h-5 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-b border-border bg-canvas/98 backdrop-blur-xl overflow-hidden shadow-lg"
          >
            <Container className="py-6 sm:py-8 flex flex-col space-y-6">
              <nav className="flex flex-col divide-y divide-border/40" aria-label="Mobile Navigation">
                {NAVIGATION_LINKS.map((item, index) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'min-h-[48px] flex items-center justify-between py-3 text-xs sm:text-sm font-sans tracking-architectural uppercase hover:text-accent focus-visible:outline-none transition-colors',
                          isActive ? 'text-accent font-semibold' : 'text-ink'
                        )}
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-ink-muted" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="pt-2 flex flex-col space-y-3 border-t border-border">
                <div className="flex flex-col space-y-1.5 text-xs font-mono">
                  <Link
                    to="/project-brief"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-accent hover:underline flex items-center justify-between py-1"
                  >
                    <span>&bull; Project Brief Builder</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/company-profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-ink hover:underline flex items-center justify-between py-1"
                  >
                    <span>&bull; Capability Statement (PDF)</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to="/services/consultation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-ink hover:underline flex items-center justify-between py-1"
                  >
                    <span>&bull; Guided Service Selector</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="pt-2">
                  <Button
                    href="/contact"
                    variant="primary"
                    size="md"
                    withArrow
                    className="w-full min-h-[44px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Discuss a Project
                  </Button>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
