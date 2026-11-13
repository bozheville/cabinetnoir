// Breadcrumb trail → schema.org BreadcrumbList JSON-LD (Google still
// supports this rich result). Labels must reflect what the visitor sees:
// the brand is the header wordmark, cipher pages sit between home and the
// tab, and the last crumb is the page's own <h1>.
import { urlFor } from '@lib/sitemap-data';

export interface Crumb {
  label: string;
  // Locale-free page path (see sitemap-data urlFor). The last crumb may
  // omit it: Google takes the current URL from the canonical.
  path?: string;
}

export const breadcrumbLd = (crumbs: Crumb[], locale: string) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.label,
    ...(crumb.path ? { item: urlFor(crumb.path, locale) } : {}),
  })),
});
