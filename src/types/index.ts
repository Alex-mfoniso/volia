export * from './auth';
export * from './recruitment';
export * from './ui';
export * from './three';

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  isExternal?: boolean;
}

export interface CompanyMeta {
  name: string;
  legalName: string;
  tagline: string;
  descriptor?: string;
  summary: string;
  publicScope: readonly string[];
  incorporationNote?: string;
  contactPlaceholder: {
    email: string;
    phone: string;
    locationNote: string;
  };
}

export interface SectionHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  invert?: boolean;
}
