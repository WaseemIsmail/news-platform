import { getIndexNowKey } from "@/lib/indexNow";

export const dynamic = "force-dynamic";

export async function GET() {
  const key = getIndexNowKey();
  if (!key) return new Response("Not configured", { status: 404 });

  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
