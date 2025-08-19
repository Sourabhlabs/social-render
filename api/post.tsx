// api/post.tsx
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',   // Important: forces Vercel to use Edge runtime
};

export default async function handler(req: Request) {
  try {
    // Example query param: /api/post?title=Hello+World
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Default Title";

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            color: "white",
            background: "linear-gradient(to right, #ff512f, #dd2476)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {title}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err: any) {
    return new Response("Failed to generate the image", { status: 500 });
  }
}
