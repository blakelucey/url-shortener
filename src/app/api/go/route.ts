import { Redis } from "@upstash/redis/cloudflare";  // edge-friendly

const redis = new Redis({
  url: process.env.NEXT_UPSTASH_REDIS_REST_URL!,
  token: process.env.NEXT_UPSTASH_REDIS_REST_TOKEN!
});

export const runtime = "edge";

/* ---------- POST /api/go ---------- */
export async function POST(req: Request) {
  const { slug, url, ttl } = await req.json().catch(() => ({}));

  console.log(slug, url, ttl)

  // Validate inputs
  if (typeof slug !== "string" || !slug.length) {
    return new Response(JSON.stringify({ message: `Invalid slug` }), { status: 400 });
  }
  if (typeof url !== "string" || !url.length)
    return new Response(JSON.stringify({ message: `Invalid url` }), { status: 400 });

  const expires = Number(ttl) > 0 ? Number(ttl) : 900; // default 15 min
  await redis.set(slug, url, { ex: expires });

  return new Response(JSON.stringify({ message: "ok" }), { status: 201 });
}