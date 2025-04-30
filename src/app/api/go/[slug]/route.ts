// app/api/go/[slug]/route.ts
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis/cloudflare";

export const runtime = "edge";

const redis = new Redis({
  url:   process.env.NEXT_UPSTASH_REDIS_REST_URL!,
  token: process.env.NEXT_UPSTASH_REDIS_REST_TOKEN!,
});

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  // 👇 MUST await ctx.params in Next 15
  const { slug } = await ctx.params;

  const url = await redis.get<string>(slug);
  if (!url) {
    return NextResponse.json({ error: "Link expired" }, { status: 410 });
  }

  // 302 temporary redirect
  return NextResponse.redirect(url, 302);
}