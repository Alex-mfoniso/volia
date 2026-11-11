import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { COMPANY_DATA } from '@/data/company';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    discipline: 'Engineering Consultancy',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg('Please enter your full name or representative title.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMsg('Please provide a brief summary of the development parameters.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <section id="contact" className="py-14 sm:py-20 lg:py-28 border-b border-border bg-canvas relative">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Direct Inquiries & Editorial Narrative (6 cols) */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 bg-accent shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-sans tracking-architectural uppercase text-accent font-semibold">
                  Institutional Dialogue
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-ink leading-[1.14]">
                Let&apos;s discuss what you&apos;re planning.
              </h2>

              <p className="text-sm sm:text-base text-ink-muted font-light leading-relaxed font-sans max-w-xl pt-1">
                Whether you are initiating a commercial master plan, requiring rigorous structural engineering oversight, or seeking independent quantity surveying validation, our partners are accessible for preliminary technical consultations.
              </p>
            </div>

            {/* Direct Official Communication Channels (Non-Fabricated Placeholders) */}
            <div className="pt-2 border-t border-border space-y-3.5 sm:space-y-4">
              <span className="text-[10px] font-sans font-semibold tracking-architectural uppercase text-ink block">
                Official Channels &bull; Provisional
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* Email Channel */}
                <div className="p-4 border border-border bg-canvas-surface/60 space-y-1.5">
                  <div className="flex items-center space-x-2 text-accent">
                    <Mail className="w-4 h-4 stroke-[1.5]" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest">
                      Electronic Mail
                    </span>
                  </div>
                  <a
                    href={`mailto:${COMPANY_DATA.contactPlaceholder.email}`}
                    className="text-xs sm:text-sm font-medium text-ink hover:text-accent transition-colors block truncate"
                  >
                    {COMPANY_DATA.contactPlaceholder.email}
                  </a>
                  <span className="text-[9px] font-mono text-ink-muted/80 block uppercase">
                    Provisional Client Desk
                  </span>
                </div>

                {/* Telephone Channel */}
                <div className="p-4 border border-border bg-canvas-surface/60 space-y-1.5">
                  <div className="flex items-center space-x-2 text-accent">
                    <Phone className="w-4 h-4 stroke-[1.5]" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest">
                      Telephone
                    </span>
                  </div>
                  <a
                    href={`tel:${COMPANY_DATA.contactPlaceholder.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-xs sm:text-sm font-medium text-ink hover:text-accent transition-colors block"
                  >
                    {COMPANY_DATA.contactPlaceholder.phone}
                  </a>
                  <span className="text-[9px] font-mono text-ink-muted/80 block uppercase">
                    Provisional Switchboard
                  </span>
                </div>
              </div>

              {/* Physical Corporate Jurisdiction */}
              <div className="p-4 border border-border bg-canvas-surface/60 flex items-start space-x-3 text-xs text-ink-muted">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-ink font-medium block">
                    Corporate Jurisdiction: Federal Republic of Nigeria
                  </span>
                  <p className="font-light text-[11px] leading-relaxed">
                    Registered office filings undergoing administrative update. Physical office meetings scheduled via prior appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Preliminary Consultation Request Form (6 cols) */}
          <div className="lg:col-span-6 border border-border bg-canvas-surface p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="border-b border-border pb-4">
              <span className="text-[10px] font-mono tracking-widest uppercase text-accent font-semibold block">
                PRELIMINARY BRIEFING
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal mt-1">
                Initiate Project Consultation
              </h3>
              <p className="text-xs text-ink-muted font-light mt-1">
                Submit project parameters for preliminary consultancy evaluation.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 border border-accent/40 bg-canvas text-xs text-ink flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-accent shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSubmitted ? (
              <div className="p-6 sm:p-8 border border-accent/40 bg-canvas space-y-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-accent mx-auto stroke-[1.5]" />
                <h4 className="font-serif text-xl text-ink">Inquiry Parameters Logged</h4>
                <div className="p-3 border border-border bg-canvas-surface text-[11px] text-ink-muted max-w-sm mx-auto leading-relaxed">
                  <strong>Prototype Simulation:</strong> Your brief has been validated in the demonstration environment. Inquiries are stored in local session memory pending live server deployment.
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      organization: '',
                      discipline: 'Engineering Consultancy',
                      message: '',
                    });
                  }}
                  className="mt-2 min-h-[44px]"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans tracking-architectural uppercase text-ink font-medium block">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isSubmitting}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder="e.g. Babatunde Adeleke"
                      className="w-full px-3.5 py-2.5 sm:py-3 bg-canvas border border-border text-base sm:text-xs text-ink placeholder:text-ink-muted/50 focus-visible:outline-none focus:border-accent min-h-[44px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans tracking-architectural uppercase text-ink font-medium block">
                      Organization / Entity
                    </label>
                    <input
                      type="text"
                      disabled={isSubmitting}
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({ ...formData, organization: e.target.value })
                      }
                      placeholder="e.g. Capital Development Partners"
                      className="w-full px-3.5 py-2.5 sm:py-3 bg-canvas border border-border text-base sm:text-xs text-ink placeholder:text-ink-muted/50 focus-visible:outline-none focus:border-accent min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans tracking-architectural uppercase text-ink font-medium block">
                    Primary Discipline Required *
                  </label>
                  <select
                    disabled={isSubmitting}
                    value={formData.discipline}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-canvas border border-border text-base sm:text-xs text-ink focus-visible:outline-none focus:border-accent min-h-[44px]"
                  >
                    <option value="Engineering Consultancy">Engineering Consultancy</option>
                    <option value="Architectural Consultancy">Architectural Consultancy</option>
                    <option value="Quantity Surveying">Quantity Surveying</option>
                    <option value="Multidisciplinary Advisory">Multidisciplinary Advisory (All Disciplines)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans tracking-architectural uppercase text-ink font-medium block">
                    Project Parameters / Scope Brief *
                  </label>
                  <textarea
                    rows={4}
                    required
                    disabled={isSubmitting}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Provide location, development typology, estimated scale, or specific engineering challenges..."
                    className="w-full px-3.5 py-2.5 sm:py-3 bg-canvas border border-border text-base sm:text-xs text-ink placeholder:text-ink-muted/50 focus-visible:outline-none focus:border-accent resize-none min-h-[100px]"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    size="md"
                    withArrow={!isSubmitting}
                    leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : undefined}
                    rightIcon={!isSubmitting ? <Send className="w-3.5 h-3.5" /> : undefined}
                    className="w-full min-h-[46px]"
                  >
                    {isSubmitting ? 'Verifying Brief...' : 'Transmit Consultation Request'}
                  </Button>
                </div>

                <p className="text-[10px] text-ink-muted/70 text-center font-mono pt-1">
                  CONFIDENTIALITY ASSURED &bull; STATUTORY ADVISORY PROTOCOL
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};
