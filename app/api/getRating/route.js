import { NextResponse } from "next/server";
import { getClient } from '../../lib/dbClient';


export async function GET(req) {
  const client = await getClient();

  try {
    const result = await client.query(
      'SELECT SUM(rating)/COUNT(*)::numeric as avgRating from ratings;'
    );

    return new NextResponse(JSON.stringify({ result: result }), { status: 200 });
  } catch (error) {
    console.error('Error handling POST request:', error);

    return new NextResponse(JSON.stringify({ error: 'Failed to insert data' }), { status: 500 });
  }
}
