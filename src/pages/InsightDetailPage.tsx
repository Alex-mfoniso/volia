import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ReusableCTA } from '@/components/layout/ReusableCTA';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';
import { INSIGHT_ARTICLES } from '@/data/insightsData';
import {
  Clock,
  Calendar,
  ArrowLeft,
  ArrowUpRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const InsightDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = INSIGHT_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return <Navigate to="/insights" replace />;
  }

  const relatedArticles = INSIGHT_ARTICLES.filter((a) =>
    article.relatedSlugs.includes(a.slug)
  );

  return (
    <AppLayout>
      <SEO
        title={`${article.title} | Technical Insights`}
        description={article.summary}
        canonicalPath={`/insights/${article.slug}`}
      />

      {/* Editorial Article Masthead */}
      <section className="pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-10 sm:pb-14 border-b border-border bg-canvas">
        <Container size="narrow">
          <div className="space-y-6">
            {/* Back to Insights */}
            <Link
              to="/insights"
              className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-ink-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Technical Resource Centre</span>
            </Link>

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-ink-muted pt-2">
              <span className="text-accent font-semibold uppercase tracking-widest px-2.5 py-1 border border-border bg-canvas-surface">
                {article.category}
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span>{article.readTime}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                <span>{article.publishedDate}</span>
              </span>
            </div>

            {/* Title & Deck */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink font-normal leading-[1.15] tracking-tight">
              {article.title}
            </h1>

            <p className="text-sm sm:text-base text-ink-muted font-light leading-relaxed font-sans border-l-2 border-accent pl-4">
              {article.summary}
            </p>

            <div className="pt-2 text-xs font-mono text-ink-muted">
              Authored by <strong>{article.authorRole}</strong> &bull; VOLIA NIG LTD Advisory Directorate
            </div>
          </div>
        </Container>
      </section>

      {/* Main Article Body */}
      <article className="py-12 sm:py-16 lg:py-20 border-b border-border bg-canvas">
        <Container size="narrow">
          <div className="space-y-10 sm:space-y-12">
            {/* Editorial Demonstration Notice */}
            <div className="p-4 border border-border bg-canvas-surface/80 flex items-start space-x-3 text-xs text-ink-muted">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>EDITORIAL DEMONSTRATION NOTICE:</strong> This technical monograph is an illustrative publication prototype developed to demonstrate VOLIA&apos;s technical writing and knowledge-dissemination architecture. Official publication requires executive editorial clearance.
              </p>
            </div>

            {/* Large Lead Image */}
            <div className="relative aspect-[16/9] overflow-hidden border border-border bg-canvas-surface">
              <img
                src={article.coverImage}
                alt={article.coverAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 bg-canvas/90 backdrop-blur-sm px-2.5 py-1 border border-border text-[10px] font-mono uppercase text-ink">
                ARCHITECTURAL &bull; TECHNICAL SPECIMEN
              </div>
            </div>

            {/* Key Takeaways Box */}
            <div className="border border-accent/40 bg-accent/5 p-6 sm:p-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold block">
                Executive &amp; Technical Takeaways
              </span>
              <div className="grid grid-cols-1 gap-3">
                {article.keyTakeaways.map((takeaway, i) => (
                  <div key={i} className="flex items-start space-x-3 text-xs text-ink">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Article Content Sections */}
            <div className="space-y-10 font-sans text-ink leading-relaxed">
              {article.sections.map((section, idx) => (
                <section key={idx} className="space-y-4">
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-snug border-b border-border pb-2">
                    {section.heading}
                  </h2>

                  <div className="space-y-3.5 text-sm sm:text-base text-ink/90 font-light leading-relaxed">
                    {section.body.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>

                  {/* Callout Quote */}
                  {section.callout && (
                    <blockquote className="my-6 p-5 sm:p-6 border-y border-accent/40 bg-canvas-surface/60 font-serif italic text-lg sm:text-xl text-ink leading-relaxed">
                      {section.callout}
                    </blockquote>
                  )}

                  {/* Figure Caption */}
                  {section.figure && (
                    <div className="p-3 border border-border bg-canvas-surface text-xs font-mono text-ink-muted flex items-center justify-between">
                      <span>{section.figure.caption}</span>
                      <span className="text-accent uppercase font-bold">{section.figure.number}</span>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Article Footer & Consultation Link */}
            <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs font-mono text-ink-muted">
                CATEGORY: <span className="text-ink font-semibold">{article.category}</span>
              </div>
              <Button
                href={`/services/consultation?projectType=${encodeURIComponent(article.category)}`}
                variant="outline"
                size="sm"
                withArrow
              >
                Consult With Our Directorate
              </Button>
            </div>
          </div>
        </Container>
      </article>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="py-12 sm:py-16 border-b border-border bg-canvas-surface/40">
          <Container size="narrow">
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-ink font-semibold">
                  Related Technical Monographs
                </span>
                <Link
                  to="/insights"
                  className="text-xs font-mono text-accent hover:underline flex items-center space-x-1"
                >
                  <span>View All Monographs</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedArticles.map((rel) => (
                  <article key={rel.id} className="border border-border bg-canvas p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-accent uppercase font-semibold">
                        {rel.category}
                      </span>
                      <h4 className="font-serif text-lg text-ink font-normal hover:text-accent transition-colors">
                        <Link to={`/insights/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                      <p className="text-xs text-ink-muted line-clamp-2 font-light">
                        {rel.summary}
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] font-mono text-ink-muted flex items-center justify-between">
                      <span>{rel.readTime}</span>
                      <Link to={`/insights/${rel.slug}`} className="text-accent underline">Read &rarr;</Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      <ReusableCTA
        title="Require structural, architectural, or cost advisory?"
        description="Our team prepares feasibility reports, structural engineering reviews, and bills of quantities for major developments."
      />
    </AppLayout>
  );
};
