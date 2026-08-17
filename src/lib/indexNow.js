import "server-only";
import { absoluteUrl, siteMetadata } from "./metadata";

const KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export function getIndexNowKey() {
  const key = String(process.env.INDEXNOW_KEY || "").trim();
  return KEY_PATTERN.test(key) ? key : "";
}

function uniqueSiteUrls(urls = []) {
  const siteHost = new URL(siteMetadata.siteUrl).host;
  return [...new Set(urls)]
    .map((value) => {
      try {
        return new URL(value).toString();
      } catch {
        return "";
      }
    })
    .filter((value) => value && new URL(value).host === siteHost)
    .slice(0, 100);
}

export function buildDiscoveryLinks(article = {}) {
  const slug = String(article.slug || "").trim();
  const articleUrl = slug ? absoluteUrl(`/article/${encodeURIComponent(slug)}`) : "";
  return {
    articleUrl,
    latestUrl: absoluteUrl("/latest"),
    rssUrl: absoluteUrl("/feed.xml"),
    sitemapUrl: absoluteUrl("/sitemap.xml"),
    newsSitemapUrl: absoluteUrl("/news-sitemap.xml"),
  };
}

function changedListingUrls(article = {}) {
  const links = buildDiscoveryLinks(article);
  const category = String(article.category || "").trim();
  const tags = Array.isArray(article.tags) ? article.tags : [];
  return uniqueSiteUrls([
    links.articleUrl,
    links.latestUrl,
    category ? absoluteUrl(`/category/${encodeURIComponent(category)}`) : "",
    ...tags.slice(0, 5).map((tag) => absoluteUrl(`/tag/${encodeURIComponent(String(tag))}`)),
  ]);
}

export async function notifyIndexNow(article = {}) {
  const key = getIndexNowKey();
  if (!process.env.INDEXNOW_KEY) {
    return { submitted: false, status: "not_configured" };
  }
  if (!key) {
    return { submitted: false, status: "invalid_key" };
  }

  const urlList = changedListingUrls(article);
  if (!urlList.length) {
    return { submitted: false, status: "no_urls" };
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteMetadata.siteUrl).host,
        key,
        keyLocation: absoluteUrl("/indexnow-key.txt"),
        urlList,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok && response.status !== 202) {
      return { submitted: false, status: "failed", httpStatus: response.status, urlCount: urlList.length };
    }

    return {
      submitted: true,
      status: response.status === 202 ? "accepted_pending_verification" : "submitted",
      httpStatus: response.status,
      urlCount: urlList.length,
    };
  } catch (error) {
    console.warn("IndexNow notification failed without blocking publication:", error?.message || error);
    return { submitted: false, status: "temporarily_unavailable", urlCount: urlList.length };
  }
}

export async function buildPublishDistribution(article = {}, { notify = true } = {}) {
  const links = buildDiscoveryLinks(article);
  const indexNow = notify
    ? await notifyIndexNow(article)
    : { submitted: false, status: "not_resubmitted" };
  return { ...links, indexNow };
}
