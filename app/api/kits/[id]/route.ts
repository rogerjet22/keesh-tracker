import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const kitRes = await db.query('SELECT * FROM kits WHERE id = $1 LIMIT 1', [id]);
    if (!kitRes.rows.length) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const kit = kitRes.rows[0];

    const outRes = await db.query('SELECT * FROM outbound_shipments WHERE kit_id = $1 ORDER BY created_at DESC LIMIT 1', [id]);
    const retRes = await db.query('SELECT * FROM return_shipments WHERE kit_id = $1 ORDER BY created_at DESC LIMIT 1', [id]);

    return NextResponse.json({ kit, outbound: outRes.rows[0] || null, return: retRes.rows[0] || null });
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
