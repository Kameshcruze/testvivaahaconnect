import React from 'react';

export const SECTION_PATHS: Record<string, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  'why-choose-us': '/why-choose-us',
  registration: '/registration',
  faq: '/faq',
  contact: '/contact',
  testing: '/testing',
};

export function getSectionIdFromPath(path: string): string {
  const cleanPath = path.trim().replace(/\/$/, '');
  if (!cleanPath || cleanPath === '/') return 'home';
  const segment = cleanPath.replace(/^\//, '').toLowerCase();
  if (segment === 'process') return 'registration';
  return segment;
}

export function navigateToSection(sectionId: string, e?: React.MouseEvent) {
  if (e) {
    e.preventDefault();
  }

  const targetId = sectionId === 'process' ? 'registration' : sectionId;
  const el = document.getElementById(targetId);

  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  } else if (targetId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const targetPath = SECTION_PATHS[targetId] || (targetId === 'home' ? '/' : `/${targetId}`);
  if (window.location.pathname !== targetPath) {
    window.history.pushState({ sectionId: targetId }, '', targetPath);
  }
}
