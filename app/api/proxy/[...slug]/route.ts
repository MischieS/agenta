import { NextRequest } from 'next/server';
import { ApiError, apiErrorResponse, apiResponse, createApiHandler } from '@/lib/api/api-handler';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Helper function to create a proxy URL from the request
 */
function createProxyUrl(request: NextRequest): string {
  const url = new URL(request.url);
  return `${BACKEND_URL}${url.pathname.replace('/api/proxy', '')}${url.search}`;
}

/**
 * Proxy API route to forward requests to the backend
 * This helps avoid CORS issues by proxying requests through Next.js
 * Uses our standardized API handler for consistent error handling
 */
export const GET = createApiHandler(async (request: NextRequest) => {
  const response = await proxyRequest(createProxyUrl(request), request);
  // Convert Response to NextResponse with appropriate ApiResponse format
  return apiResponse(await getResponseData(response));
});

export const POST = createApiHandler(async (request: NextRequest) => {
  const response = await proxyRequest(createProxyUrl(request), request);
  return apiResponse(await getResponseData(response));
});

export const PUT = createApiHandler(async (request: NextRequest) => {
  const response = await proxyRequest(createProxyUrl(request), request);
  return apiResponse(await getResponseData(response));
});

export const DELETE = createApiHandler(async (request: NextRequest) => {
  const response = await proxyRequest(createProxyUrl(request), request);
  return apiResponse(await getResponseData(response));
});

export const PATCH = createApiHandler(async (request: NextRequest) => {
  const response = await proxyRequest(createProxyUrl(request), request);
  return apiResponse(await getResponseData(response));
});

/**
 * Helper to extract data from a response based on content type
 */
async function getResponseData(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

/**
 * Helper function to proxy requests to the backend with improved error handling
 */
async function proxyRequest(targetUrl: string, request: NextRequest): Promise<Response> {
  try {
    const headers = new Headers(request.headers);
    
    // Ensure content type is set
    if (!headers.has('Content-Type') && request.method !== 'GET') {
      headers.set('Content-Type', 'application/json');
    }
    
    // Get auth token from cookies or authorization header
    const authToken = headers.get('authorization')?.replace('Bearer ', '') || 
                      request.cookies.get('auth_token')?.value || 
                      request.cookies.get('sb-access-token')?.value;
                      
    // Set authorization header if token exists
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }

    // Prepare the request to forward
    const requestInit: RequestInit = {
      method: request.method,
      headers,
      credentials: 'include',
      body: request.method !== 'GET' ? await request.text() : undefined
    };

    const response = await fetch(targetUrl, requestInit);
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    
    // Handle non-OK responses with better error reporting
    if (!response.ok) {
      let errorMessage = 'Backend request failed';
      let errorDetails = {};
      
      if (isJson) {
        const errorData = await response.json().catch(() => ({}));
        errorMessage = errorData.error || errorData.message || errorMessage;
        errorDetails = errorData;
      } else {
        errorMessage = await response.text().catch(() => errorMessage);
      }
      
      throw new ApiError(errorMessage, response.status);
    }
    
    // Return successful response without processing
    // Processing happens in the handler wrappers
    return response;
  } catch (error) {
    console.error('Proxy error:', error);
    
    if (error instanceof ApiError) {
      return apiErrorResponse(error.message, error.statusCode);
    }
    
    return apiErrorResponse('Internal server error', 500);
  }
}
