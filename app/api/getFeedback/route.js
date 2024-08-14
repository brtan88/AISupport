import { NextResponse } from "next/server";
import { getClient } from '../../lib/dbClient';


export async function GET(req) {
  const client = await getClient();

  try {
    const result = await client.query(
      'SELECT name, feedback from ratings LIMIT 10;'
    );

    return new NextResponse(JSON.stringify({ result: result.rows }), { status: 200 });
  } catch (error) {
    console.error('Error handling POST request:', error);

    return new NextResponse(JSON.stringify({ error: 'Failed to insert data' }), { status: 500 });
  }
}
