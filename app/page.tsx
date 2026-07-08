import React from 'react';
import db from '@/lib/db';

async function getKits() {
  const res = await db.query('SELECT * FROM kits ORDER BY created_at DESC');
  return res.rows || [];
}

export default async function Page() {
  const kits = await getKits();

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">KEESH Dashboard</h1>
      </header>

      <section>
        <div className="mb-4 flex justify-between">
          <input id="q" placeholder="Search customer or order ID" className="border rounded px-3 py-2 w-80" />
        </div>

        <div className="bg-white shadow rounded">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Draft Order ID</th>
                <th className="p-3 text-left">Outbound</th>
                <th className="p-3 text-left">Return</th>
                <th className="p-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {kits.map((k: any) => (
                <tr key={k.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{k.customer_name}</td>
                  <td className="p-3">{k.shopify_draft_order_id}</td>
                  <td className="p-3">
                    <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">{k.status}</span>
                  </td>
                  <td className="p-3">-</td>
                  <td className="p-3">{new Date(k.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
