import { useEffect } from 'react';
import { COMPANY_DATA } from '@/data/company';

export interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalPath = '',
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
}) => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://volia.ng';
  const fullTitle = `${title} | ${COMPANY_DATA.legalName}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // 2. Helper to set or update meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard meta
    setMeta('description', description);
    setMeta('author', COMPANY_DATA.legalName);

    // Open Graph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', ogType, true);
    setMeta('og:site_name', COMPANY_DATA.legalName, true);
    setMeta('og:image', ogImage, true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // 3. Update Canonical Link
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);

    // 4. Update JSON-LD Structured Data
    const structuredDataId = 'volia-jsonld-schema';
    let scriptTag = document.getElementById(structuredDataId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = structuredDataId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: COMPANY_DATA.legalName,
      alternateName: COMPANY_DATA.name,
      description: COMPANY_DATA.summary,
      url: siteUrl,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NG',
        addressRegion: 'Nigeria',
      },
      knowsAbout: [
        'Engineering Consultancy',
        'Architectural Consultancy',
        'Quantity Surveying',
        'Structural Engineering',
        'Civil Systems',
      ],
      serviceType: [
        'Engineering Consultancy',
        'Architectural Consultancy',
        'Quantity Surveying',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: COMPANY_DATA.contactPlaceholder.phone,
        email: COMPANY_DATA.contactPlaceholder.email,
        contactType: 'customer support',
      },
    };

    scriptTag.text = JSON.stringify(schemaData);
  }, [fullTitle, description, canonicalUrl, ogType, ogImage, siteUrl]);

  return null;
};
