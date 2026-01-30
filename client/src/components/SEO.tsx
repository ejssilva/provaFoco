import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  keywords,
  ogImage,
  ogTitle,
  ogDescription,
  canonicalUrl,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta tags
    updateMetaTag("name", "description", description);
    if (keywords) updateMetaTag("name", "keywords", keywords);
    if (noindex) updateMetaTag("name", "robots", "noindex, nofollow");

    // Open Graph tags
    updateMetaTag("property", "og:title", ogTitle || title);
    updateMetaTag("property", "og:description", ogDescription || description);
    if (ogImage) updateMetaTag("property", "og:image", ogImage);
    updateMetaTag("property", "og:type", "website");

    // Canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", canonicalUrl);
    }

    // Twitter Card
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", ogTitle || title);
    updateMetaTag("name", "twitter:description", ogDescription || description);
    if (ogImage) updateMetaTag("name", "twitter:image", ogImage);
  }, [title, description, keywords, ogImage, ogTitle, ogDescription, canonicalUrl, noindex]);

  return null;
}

function updateMetaTag(
  type: "name" | "property",
  name: string,
  content: string
) {
  let tag = document.querySelector(`meta[${type}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(type, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}
