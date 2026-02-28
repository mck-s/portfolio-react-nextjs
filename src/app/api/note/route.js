import Parser from "rss-parser";

const FEED_URL = "https://note.com/makechan/rss";
const MAX_ITEMS = 6;

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

export async function GET() {
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
    const items = (feed.items || [])
      .filter((item) => item?.title && item?.link)
      .sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0))
      .slice(0, MAX_ITEMS)
      .map((item) => ({
        title: item.title,
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
      }
    );
  } catch (error) {
    return Response.json(
      { items: [], error: "Failed to load note feed." },
      { status: 200 }
    );
  }
}
