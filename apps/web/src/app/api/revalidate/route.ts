import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-demand revalidation API route
 * 
 * Usage:
 * POST /api/revalidate?secret=YOUR_SECRET_TOKEN
 * Body: { path: "/yellow-books" } or { path: "/yellow-books/1" }
 * 
 * Example with curl:
 * curl -X POST "http://localhost:3000/api/revalidate?secret=my-secret-token" \
 *   -H "Content-Type: application/json" \
 *   -d '{"path":"/yellow-books"}'
 */

export async function POST(request: NextRequest) {
  // Verify secret token for security
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { 
        error: 'Invalid secret token',
        message: 'Та зөвхөн зөвшөөрөгдсөн secret token ашиглан revalidate хийх боломжтой' 
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { path, tag } = body;

    // Revalidate by path
    if (path) {
      await revalidatePath(path);
      console.log(`✅ Revalidated path: ${path}`);
      
      return NextResponse.json({
        revalidated: true,
        type: 'path',
        path,
        message: `Амжилттай revalidate хийлээ: ${path}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Revalidate by tag
    if (tag) {
      await revalidateTag(tag);
      console.log(`✅ Revalidated tag: ${tag}`);
      
      return NextResponse.json({
        revalidated: true,
        type: 'tag',
        tag,
        message: `Амжилттай revalidate хийлээ (tag): ${tag}`,
        timestamp: new Date().toISOString(),
      });
    }

    // No path or tag provided
    return NextResponse.json(
      { 
        error: 'Missing parameters',
        message: 'path эсвэл tag параметр шаардлагатай' 
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Revalidation error:', error);
    
    return NextResponse.json(
      { 
        error: 'Revalidation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Provide information about the API on GET requests
export async function GET() {
  return NextResponse.json({
    name: 'On-demand Revalidation API',
    description: 'ISR хуудсуудыг on-demand revalidate хийх API',
    usage: {
      method: 'POST',
      url: '/api/revalidate?secret=YOUR_SECRET_TOKEN',
      body: {
        path: '/yellow-books',
        example_paths: [
          '/yellow-books',
          '/yellow-books/1',
          '/yellow-books/2',
        ],
      },
      note: 'REVALIDATION_SECRET environment variable шаардлагатай',
    },
    examples: [
      {
        description: 'Revalidate ISR list page',
        curl: 'curl -X POST "http://localhost:3000/api/revalidate?secret=my-secret" -H "Content-Type: application/json" -d \'{"path":"/yellow-books"}\'',
      },
      {
        description: 'Revalidate specific organization page',
        curl: 'curl -X POST "http://localhost:3000/api/revalidate?secret=my-secret" -H "Content-Type: application/json" -d \'{"path":"/yellow-books/1"}\'',
      },
    ],
  });
}
