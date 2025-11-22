-- 1. Enable PostGIS for location features
create extension if not exists postgis;

-- 2. FARMERS (Profile + Geo-Context)
create table farmers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  phone_number text unique not null,
  crop_type text not null, -- 'Cacao', 'Coffee'
  farm_size_hectares numeric(5,2),
  barangay text, 
  latitude numeric(10,8), 
  longitude numeric(11,8),
  trust_score numeric(3,2) default 5.0 -- AI adjusts based on forecast accuracy
);

-- 3. STATIONS (Physical Hubs)
create table stations (
  id uuid default uuid_generate_v4() primary key,
  name text not null, 
  organization_id uuid, -- Links to 'Cacao de Davao' or 'FROG KAFFEE'
  location text,
  inventory_wet_kg numeric(10,2) default 0,
  inventory_dry_kg numeric(10,2) default 0
);

-- 4. ORDERS (The Procurement Engine)
create table orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  
  -- Logistics
  station_id uuid references stations(id),
  organization_id uuid, -- SME ID
  
  -- The Request
  target_amount_kg numeric(10,2) not null,
  crop_state text not null, -- 'Wet', 'Dry'
  deadline date,
  
  -- The Negotiation (New Fields)
  committed_amount_kg numeric(10,2) default 0,
  
  -- The Progress
  filled_amount_kg numeric(10,2) default 0, -- Collected at station
  dispatched_amount_kg numeric(10,2) default 0, -- Sent to factory
  received_amount_kg numeric(10,2) default 0, -- Weighed at factory
  
  -- The Result
  variance_kg numeric(10,2) generated always as (received_amount_kg - dispatched_amount_kg) stored,
  
  -- State Machine
  status text default 'pending_review'
  -- Values: 'pending_review', 'commitment_proposed', 'collecting', 'in_transit', 'received', 'cancelled'
);

-- 5. FORECASTS (Agent Inputs)
create table forecasts (
  id uuid default uuid_generate_v4() primary key,
  farmer_id uuid references farmers(id),
  predicted_amount_kg numeric(6,2),
  confidence_score numeric(3,2), -- AI Confidence
  linked_order_id uuid references orders(id) -- Links forecast to specific PO demand
);