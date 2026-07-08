import React from 'react';

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_HOST) return process.env.NEXT_PUBLIC_HOST.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

async function getKit(id: string) {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/kits/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load');
  return res.json();
}

export default async function KitPage({ params }: { params: { id: string } }) {
  const data = await getKit(params.id);
  const kit = data.kit;
  const outbound = data.outbound;
  const ret = data.return;

  return (
    <main>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{kit.customer_name}</h2>
        <div className="text-sm text-gray-600">Draft order: {kit.shopify_draft_order_id}</div>
        <div className="mt-2">
          <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800">{kit.status}</span>
        </div>
      </div>

      <section className="bg-white shadow rounded p-4 mb-4">
        <h3 className="font-medium mb-2">Outbound</h3>
        {outbound ? (
          <div>
            <div>Shippo status: {outbound.shippo_status}</div>
            <div>Tracking: {outbound.tracking_number || '-'}</div>
            <div>Carrier: {outbound.carrier || '-'}</div>
          </div>
        ) : (
          <div className="text-sm text-gray-600">No outbound shipment yet</div>
        )}
      </section>

      <section className="bg-white shadow rounded p-4">
        <h3 className="font-medium mb-2">Return</h3>
        {ret ? (
          <div>
            <div>Tracking: {ret.tracking_number}</div>
            <div>Status: {ret.status}</div>
          </div>
        ) : (
          <form method="post" action="/api/returns" className="flex gap-2">
            <input type="hidden" name="kit_id" value={kit.id} />
            <input name="tracking_number" placeholder="R123456" className="border rounded px-3 py-2" />
            <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Add return tracking</button>
          </form>
        )}
      </section>
    </main>
  );
}
