import { NextResponse } from "next/server";
import { getClient } from '../../lib/dbClient';


export async function POST(req) {
  const client = await getClient();

  try {
    const data = await req.json();
    
    const result = await client.query(
      'INSERT INTO ratings (rating, name, feedback) VALUES ($1, $2, $3);',
      [data.rating, data.name, data.feedback]
    );
    
    return new NextResponse(JSON.stringify({ message: 'Data inserted successfully!' }), { status: 200 });
  } catch (error) {
    console.error('Error handling POST request:', error);

    return new NextResponse(JSON.stringify({ error: 'Failed to insert data' }), { status: 500 });
  }
}
