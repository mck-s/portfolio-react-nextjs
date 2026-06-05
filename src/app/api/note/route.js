import Parser from "rss-parser";

const FEED_URL = "https://note.com/makechan/rss";
const MAX_ITEMS = 6;

// In-memory cache: { [link]: { enTitle, fetchedAt } }
const enTitleCache = {};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function extractFirstImage(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  const url = match ? match[1] : null;
  if (!url) return null;
  if (url.startsWith("data:") || url.includes("emoji")) return null;
  return url;
}

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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

    // Try og:title first, fall back to <title>
    const ogMatch =
      html.match(
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
      ) ||
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i,
      );
    if (ogMatch) {
      const enTitle = ogMatch[1].trim();
      enTitleCache[link] = { enTitle, fetchedAt: Date.now() };
      return enTitle;
    }

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      // note's <title> often has " | note" suffix — strip it
      const enTitle = titleMatch[1].replace(/\s*\|.*$/, "").trim();
      enTitleCache[link] = { enTitle, fetchedAt: Date.now() };
      return enTitle;
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

    // Fetch English titles in parallel if needed
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

    const shuffled = shuffle(items);

    return Response.json(
      { items: shuffled },
      {
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
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
