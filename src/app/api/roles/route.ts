import { NextRequest, NextResponse } from 'next/server';
import { queryRoles } from '../database/roles';


export async function GET(request: NextRequest) {
  try {
    // Parse URL parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || undefined;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | undefined;
    
    // Parse filters (they come in format filter[field]=value)
    const filter: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('filter[') && key.endsWith(']')) {
        const filterField = key.slice(7, -1); // Extract field name from filter[field]
        filter[filterField] = value;
      }
    }
    
    // Introduce artificial delay to simulate network latency (optional)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Query the mock database
    const result = queryRoles({
      page,
      limit,
      sortBy,
      sortOrder,
      filter
    });
    
    // Return the result
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}