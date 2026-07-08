-- KEESH Dashboard schema

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE kits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shopify_draft_order_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  status TEXT NOT NULL DEFAULT 'AWAITING_LABEL',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE outbound_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id UUID NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  tracking_number TEXT,
  carrier TEXT,
  shippo_status TEXT DEFAULT 'UNKNOWN',
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE return_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kit_id UUID NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  tracking_number TEXT NOT NULL,
  carrier TEXT DEFAULT 'Australia Post',
  status TEXT DEFAULT 'CREATED',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT NOT NULL,
  status TEXT,
  location TEXT,
  event_time TIMESTAMP,
  raw JSONB,
  created_at TIMESTAMP DEFAULT now()
);
