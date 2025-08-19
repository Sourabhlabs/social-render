// api/post.tsx
import { ImageResponse } from '@vercel/og';

// Tell Vercel this is an Edge Function that can return images
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  // Friendly message if someone opens in a browser
  if (req.method === 'GET') {
    return new Response(
      'OK: POST JSON to this URL to render an image. Example body: {"title":"Hello"}',
      { status: 200, headers: { 'content-type': 'text/plain' } }
    );
  }

  // Parse JSON safely
  let body: any = {};
  try { body = await req.json(); } catch {}

  // For this first test, just render a simple image with a title
  const title = (body?.title ?? 'Hello from social-render').toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#111827',
          color: '#F9FAFB',
          fontSize: 64,
          fontWeight: 800,
          fontFamily: 'Inter, Arial',
        }}
      >
        {title}
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}
