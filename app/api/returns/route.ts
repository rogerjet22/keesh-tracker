import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kit_id, tracking_number } = body;
    if (!kit_id || !tracking_number) return NextResponse.json({ error: 'missing' }, { status: 400 });

    const res = await db.query(
      `INSERT INTO return_shipments (kit_id, tracking_number) VALUES ($1,$2) RETURNING *`,
      [kit_id, tracking_number]
    );
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
