import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Proxy API route to forward requests to the backend
 * This helps avoid CORS issues by proxying requests through Next.js
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}${url.pathname.replace('/api/proxy', '')}${url.search}`;
  
  return await proxyRequest(targetUrl, request);
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}${url.pathname.replace('/api/proxy', '')}${url.search}`;
  
  return await proxyRequest(targetUrl, request);
}

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}${url.pathname.replace('/api/proxy', '')}${url.search}`;
  
  return await proxyRequest(targetUrl, request);
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const targetUrl = `${BACKEND_URL}${url.pathname.replace('/api/proxy', '')}${url.search}`;
  
  return await proxyRequest(targetUrl, request);
}

/**
 * Helper function to proxy requests to the backend
 */
async function proxyRequest(targetUrl: string, request: NextRequest) {
  try {
    const requestInit: RequestInit = {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      // Forward cookies for authentication
      credentials: 'include',
    };

    // Forward the body for non-GET requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      requestInit.body = await request.text();
    }

    const response = await fetch(targetUrl, requestInit);
    
    // Forward the response status and body
    const responseBody = await response.text();
    
    // Create a new response with the same status and body
    const newResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      }
    });
    
    return newResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to backend' },
      { status: 500 }
    );
  }
}
