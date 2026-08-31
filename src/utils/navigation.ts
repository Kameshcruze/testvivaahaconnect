import React from 'react';

export const SECTION_PATHS: Record<string, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  'why-choose-us': '/why-choose-us',
  registration: '/registration',
  process: '/registration',
  faq: '/faq',
  contact: '/contact',
  testing: '/registration',
  admin: '/admin',
};

export type AppPage = 'home' | 'registration' | 'admin';

export function getPageFromPath(path: string): AppPage {
  const clean = path.trim().toLowerCase().replace(/\/$/, '');
  if (clean === '/admin' || clean === '/admin-login' || clean === '/dashboard') {
    return 'admin';
  }
  if (clean === '/registration' || clean === '/register' || clean === '/testing') {
    return 'registration';
  }
  return 'home';
}

export function getSectionIdFromPath(path: string): string {
  const cleanPath = path.trim().replace(/\/$/, '');
  if (!cleanPath || cleanPath === '/') return 'home';
  const segment = cleanPath.replace(/^\//, '').toLowerCase();
  if (segment === 'process') return 'registration';
  if (segment === 'admin' || segment === 'admin-login') return 'admin';
  return segment;
}

export function navigateToPage(page: AppPage, sectionId?: string, e?: React.MouseEvent) {
  if (e) {
    e.preventDefault();
  }

  const targetPath =
    page === 'admin'
      ? '/admin'
      : page === 'registration'
      ? '/registration'
      : sectionId && sectionId !== 'home'
      ? `/${sectionId}`
      : '/';

  window.history.pushState({ page, sectionId }, '', targetPath);
  window.dispatchEvent(new CustomEvent('app-navigation', { detail: { page, sectionId } }));

  if (page === 'registration' || page === 'admin') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (sectionId && sectionId !== 'home') {
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function navigateToSection(sectionId: string, e?: React.MouseEvent) {
  if (e) {
    e.preventDefault();
  }

  if (sectionId === 'admin' || sectionId === 'admin-login') {
    navigateToPage('admin', undefined, e);
    return;
  }

  if (sectionId === 'registration' || sectionId === 'testing' || sectionId === 'register') {
    navigateToPage('registration', undefined, e);
    return;
  }

  // Navigate to home section
  navigateToPage('home', sectionId, e);
}
