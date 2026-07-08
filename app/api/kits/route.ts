import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shopify_draft_order_id, customer_name, customer_email } = body;
    if (!shopify_draft_order_id || !customer_name) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }

    const res = await db.query(
      `INSERT INTO kits (shopify_draft_order_id, customer_name, customer_email) VALUES ($1,$2,$3) RETURNING *`,
      [shopify_draft_order_id, customer_name, customer_email]
    );
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const res = await db.query('SELECT * FROM kits ORDER BY created_at DESC');
    return NextResponse.json(res.rows);
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
