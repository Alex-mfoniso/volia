import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReusableCTA } from '@/components/layout/ReusableCTA';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/common/SEO';
import {
  INSIGHT_CATEGORIES,
  INSIGHT_ARTICLES,
  type InsightCategory,
} from '@/data/insightsData';
import {
  BookOpen,
  Clock,
  ArrowUpRight,
  Filter,
  Search,
  X,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const InsightsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | InsightCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = INSIGHT_ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' || article.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const featuredArticle = INSIGHT_ARTICLES.find((a) => a.featured) || INSIGHT_ARTICLES[0];

  return (
    <AppLayout>
      <SEO
        title="Technical Resource Centre &amp; Engineering Monograph Series"
        description="Technical commentary, engineering insights, passive architectural strategies, and quantity surveying cost governance publications from VOLIA NIG LTD."
        canonicalPath="/insights"
      />

      <PageHeader
        kicker="Technical Knowledge &amp; Advisory"
        title="Built-Environment Insights, Engineering Standards &amp; Cost Control."
        description="A technical resource centre publishing engineering monographs, passive envelope analyses, and commercial governance frameworks tailored to Nigerian and West African construction realities."
        breadcrumb="PRACTICE // INSIGHTS"
      />

      <section className="py-12 sm:py-16 lg:py-20 border-b border-border bg-canvas">
        <Container size="wide">
          <div className="space-y-10 sm:space-y-12">
            {/* Demonstration Content Disclaimer Notice */}
            <div className="p-4 sm:p-5 border border-border bg-canvas-surface/80 flex items-start space-x-3 text-xs text-ink-muted">
              <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-ink uppercase tracking-wider text-[11px] block">
                  Editorial Demonstration Protocol &bull; Prototype Showcase
                </span>
                <p className="leading-relaxed">
                  The technical monographs and articles presented below represent <strong>demonstration editorial samples</strong> illustrating the knowledge-sharing platform of VOLIA NIG LTD. Articles are subject to executive editorial review and clearance before formal public release.
                </p>
              </div>
            </div>

            {/* Featured Article Masthead */}
            {selectedCategory === 'All' && !searchQuery && featuredArticle && (
              <div className="border border-border bg-canvas hover:border-accent transition-colors duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-canvas-surface border-b lg:border-b-0 lg:border-r border-border">
                    <img
                      src={featuredArticle.coverImage}
                      alt={featuredArticle.coverAlt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-canvas/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono uppercase text-ink border border-border">
                      FEATURED MONOGRAPH
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-[10px] font-mono text-accent">
                        <span className="uppercase font-bold tracking-widest">{featuredArticle.category}</span>
                        <span>&bull;</span>
                        <span className="flex items-center space-x-1 text-ink-muted">
                          <Clock className="w-3 h-3" />
                          <span>{featuredArticle.readTime}</span>
                        </span>
                      </div>

                      <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-snug">
                        <Link
                          to={`/insights/${featuredArticle.slug}`}
                          className="hover:text-accent transition-colors"
                        >
                          {featuredArticle.title}
                        </Link>
                      </h2>

                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-light">
                        {featuredArticle.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-[10px] font-mono text-ink-muted uppercase">
                        {featuredArticle.authorRole}
                      </span>
                      <Button
                        href={`/insights/${featuredArticle.slug}`}
                        variant="primary"
                        size="sm"
                        withArrow
                      >
                        Read Monograph
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search & Category Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
              <div className="flex items-center space-x-2 text-xs font-mono text-ink-muted">
                <Filter className="w-3.5 h-3.5 text-accent shrink-0" />
                <span className="uppercase tracking-widest text-[10px] hidden sm:inline">TOPIC:</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="tablist">
                {INSIGHT_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  const count =
                    cat === 'All'
                      ? INSIGHT_ARTICLES.length
                      : INSIGHT_ARTICLES.filter((a) => a.category === cat).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        'text-xs font-sans tracking-architectural uppercase px-3 py-1.5 sm:px-3.5 sm:py-2 transition-all duration-200 border focus-visible:outline-none flex items-center space-x-1.5 min-h-[38px]',
                        isActive
                          ? 'bg-ink text-canvas border-ink font-medium shadow-sm'
                          : 'bg-canvas text-ink-muted border-border hover:border-ink hover:text-ink'
                      )}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] font-mono opacity-60">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-72">
                <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search technical insights..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-sans bg-canvas-surface border border-border text-ink placeholder:text-ink-muted focus:outline-none focus:border-accent"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="group flex flex-col border border-border bg-canvas hover:border-accent transition-all duration-300"
                >
                  <Link
                    to={`/insights/${article.slug}`}
                    className="relative aspect-[16/10] overflow-hidden bg-canvas-surface border-b border-border block"
                  >
                    <img
                      src={article.coverImage}
                      alt={article.coverAlt}
                      className="w-full h-full object-cover transition-transform duration-700 ease-architectural group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-2.5 right-2.5 bg-canvas-dark/90 text-white backdrop-blur-sm px-2 py-0.5 text-[8px] font-sans tracking-architectural uppercase">
                      {article.category}
                    </div>
                  </Link>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center space-x-2 text-[10px] font-mono text-ink-muted">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-accent" />
                          <span>{article.readTime}</span>
                        </span>
                        <span>&bull;</span>
                        <span>{article.publishedDate}</span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-normal text-ink group-hover:text-accent transition-colors leading-snug">
                        <Link to={`/insights/${article.slug}`}>{article.title}</Link>
                      </h3>

                      <p className="text-xs text-ink-muted font-light leading-relaxed line-clamp-3">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[10px] text-ink-muted truncate pr-2">
                        {article.authorRole}
                      </span>
                      <Link
                        to={`/insights/${article.slug}`}
                        className="text-accent group-hover:underline flex items-center space-x-1 shrink-0"
                      >
                        <span>Read</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-16 border border-border bg-canvas-surface/40 p-8 space-y-3">
                <BookOpen className="w-8 h-8 text-accent mx-auto" />
                <h4 className="font-serif text-xl text-ink">No articles match your criteria</h4>
                <p className="text-xs text-ink-muted max-w-sm mx-auto">
                  Try clearing your search query or switching to another category.
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </Container>
      </section>

      <ReusableCTA
        title="Interested in commissioned technical research?"
        description="Our advisory directors provide independent structural audits, peer reviews, and forensic built-environment research for corporate and public bodies."
      />
    </AppLayout>
  );
};
