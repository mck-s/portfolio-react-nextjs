import Parser from "rss-parser";

const FEED_URL = "https://note.com/makechan/rss";
const MAX_ITEMS = 10;

// In-memory cache: { [link]: { enTitle, fetchedAt } }
const enTitleCache = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const JAPANESE_TEXT_PATTERN = /[\u3040-\u30ff\u3400-\u9fff]/;

function extractFirstImage(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  const url = match ? match[1] : null;
  if (!url) return null;
  if (url.startsWith("data:") || url.includes("emoji")) return null;
  return url;
}

function decodeHtmlEntities(value) {
  if (!value) return "";

  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16)),
    );
}

function normalizeNoteTitle(value) {
  return decodeHtmlEntities(value).replace(/\s*[|｜].*$/, "").trim();
}

function isEnglishTitle(value) {
  return value && !JAPANESE_TEXT_PATTERN.test(value);
}

async function fetchEnTitle(link) {
  const cached = enTitleCache[link];
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.enTitle;
  }

  try {
    const url = new URL(link);
    url.searchParams.set("hl", "en");
    const res = await fetch(url.toString(), {
      headers: { "Accept-Language": "en-US,en;q=0.9" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Try og:title first, fall back to <title>.
    const ogMatch =
      html.match(
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
      );
    if (ogMatch) {
      const enTitle = normalizeNoteTitle(ogMatch[1]);
      if (isEnglishTitle(enTitle)) {
        enTitleCache[link] = { enTitle, fetchedAt: Date.now() };
        return enTitle;
      }
    }

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      const enTitle = normalizeNoteTitle(titleMatch[1]);
      if (isEnglishTitle(enTitle)) {
        enTitleCache[link] = { enTitle, fetchedAt: Date.now() };
        return enTitle;
      }
    }
  } catch {
    // fall through to null
  }

  return null;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const isEnglish = searchParams.get("lang") === "en";

  try {
    const parser = new Parser({
      customFields: {
        item: [
          "image",
          ["media:thumbnail", "media:thumbnail"],
          ["media:content", "media:content"],
          ["content:encoded", "content:encoded"],
        ],
      },
    });

    const feed = await parser.parseURL(FEED_URL);

    const rawItems = (feed.items || [])
      .filter((item) => item?.title && item?.link)
      .sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0))
      .slice(0, MAX_ITEMS);

    // Fetch English titles in parallel if needed.
    const enTitles = isEnglish
      ? await Promise.all(rawItems.map((item) => fetchEnTitle(item.link)))
      : rawItems.map(() => null);

    const items = rawItems.map((item, i) => ({
      title: isEnglish && enTitles[i] ? enTitles[i] : item.title,
      link: item.link,
      date: item.pubDate || item.isoDate || null,
      thumbnail:
        item.image ||
        item.enclosure?.url ||
        item["media:thumbnail"]?.$?.url ||
        item["media:thumbnail"] ||
        item["media:content"]?.$?.url ||
        item["media:content"]?.url ||
        extractFirstImage(item["content:encoded"] || item.content) ||
        null,
    }));

    return Response.json(
      { items },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    return Response.json(
      { items: [], error: "Failed to load note feed." },
      { status: 200 },
    );
  }
}
