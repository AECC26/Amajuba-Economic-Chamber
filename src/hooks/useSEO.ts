import { useEffect } from 'react';

const SITE_NAME = 'Amajuba Economic Chamber of Commerce';
const SITE_URL = 'https://amajubaeconomicchamber.org';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  'The Amajuba Economic Chamber of Commerce drives sustainable economic development across the Amajuba District, KwaZulu-Natal. Serving 500+ members across Primary, Secondary, and Tertiary sectors.';

export interface SEOProps {
  title: string;
  description?: string;
  /** Canonical path, e.g. "/about". Defaults to current pathname. */
  path?: string;
  /** Absolute URL to OG image. Defaults to the chamber logo. */
  ogImage?: string;
  ogImageAlt?: string;
  /** 'website' | 'article'. Defaults to 'website'. */
  ogType?: string;
  /** JSON-LD structured data object(s). Pass null to skip. */
  structuredData?: object | null;
  /** Prevent search engine indexing (auth/dashboard pages). */
  noIndex?: boolean;
}

function setMeta(selector: string, attr: string, value: string) {
  let el = document.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    const [attrName, attrValue] = selector
      .replace(/^\[/, '')
      .replace(/\]$/, '')
      .split('=')
      .map((s) => s.replace(/"/g, ''));
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setStructuredData(id: string, data: object) {
  let el = document.querySelector<HTMLScriptElement>(`script[data-seo="${id}"]`);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-seo', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeStructuredData(id: string) {
  document.querySelector(`script[data-seo="${id}"]`)?.remove();
}

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt,
  ogType = 'website',
  structuredData,
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${SITE_URL}${path ?? window.location.pathname}`;
    const imageAlt = ogImageAlt ?? fullTitle;

    // Title
    document.title = fullTitle;

    // Primary meta
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[name="robots"]', 'content', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Canonical
    setLink('canonical', canonicalUrl);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[property="og:image"]', 'content', ogImage);
    setMeta('meta[property="og:image:alt"]', 'content', imageAlt);

    // Twitter Card
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('meta[name="twitter:image"]', 'content', ogImage);
    setMeta('meta[name="twitter:image:alt"]', 'content', imageAlt);

    // Structured data
    if (structuredData !== undefined) {
      if (structuredData === null) {
        removeStructuredData('page');
      } else {
        setStructuredData('page', structuredData);
      }
    }
  }, [title, description, path, ogImage, ogImageAlt, ogType, structuredData, noIndex]);
}
