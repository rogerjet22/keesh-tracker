import { NextResponse } from 'next/server';
import db from '@/lib/db';

function mapStatus(s: string | null) {
  if (!s) return 'AWAITING_LABEL';
  const u = s.toUpperCase();
  if (u.includes('TRANSIT') || u === 'TRANSIT') return 'IN_TRANSIT';
  if (u.includes('DELIVERED') || u === 'DELIVERED') return 'WITH_CLIENT';
  if (u.includes('EXCEPTION') || u === 'EXCEPTION') return 'EXCEPTION';
  return 'AWAITING_LABEL';
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const order_number = body.order_number || body.data?.object?.order_number || body.order || body.order_number;
    const tracking_number = body.tracking_number || body.data?.object?.tracking_number || body.tracking_number;
    const status = body.status || body.data?.object?.status || null;
    const carrier = body.carrier || null;

    if (!order_number) {
      return NextResponse.json({ ok: true });
    }

    // Find kit by shopify_draft_order_id
    const kitRes = await db.query('SELECT * FROM kits WHERE shopify_draft_order_id = $1 LIMIT 1', [order_number]);
    if (!kitRes.rows.length) return NextResponse.json({ ok: true });
    const kit = kitRes.rows[0];

    // Find existing outbound by order_number
    const outRes = await db.query('SELECT * FROM outbound_shipments WHERE order_number = $1 LIMIT 1', [order_number]);
    const existing = outRes.rows[0] || null;

    const shippo_status = status || 'UNKNOWN';

    if (existing) {
      // idempotency: skip if nothing changed
      if ((existing.shippo_status || '') === shippo_status && (existing.tracking_number || '') === (tracking_number || '')) {
        // still ensure kit status mapping is kept
        const mapped = mapStatus(shippo_status);
        if (mapped !== kit.status) {
          await db.query('UPDATE kits SET status=$1, updated_at=now() WHERE id=$2', [mapped, kit.id]);
        }
        return NextResponse.json({ ok: true });
      }

      // update
      const deliveredAt = shippo_status.toUpperCase().includes('DELIVERED') ? 'now()' : 'NULL';
      await db.query(
        `UPDATE outbound_shipments SET tracking_number=$1, carrier=$2, shippo_status=$3, updated_at=now(), delivered_at = CASE WHEN $4 THEN now() ELSE delivered_at END WHERE id=$5`,
        [tracking_number, carrier, shippo_status, shippo_status.toUpperCase().includes('DELIVERED'), existing.id]
      );
    } else {
      await db.query(
        `INSERT INTO outbound_shipments (kit_id, order_number, tracking_number, carrier, shippo_status) VALUES ($1,$2,$3,$4,$5)`,
        [kit.id, order_number, tracking_number, carrier, shippo_status]
      );
    }

    // update kit status according to mapping
    const mapped = mapStatus(shippo_status);
    if (mapped !== kit.status) {
      await db.query('UPDATE kits SET status=$1, updated_at=now() WHERE id=$2', [mapped, kit.id]);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'server error' }, { status: 500 });
  }
}
