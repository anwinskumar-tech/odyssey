-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.found_device1 (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  device_name text NOT NULL,
  brand text,
  description text,
  location text,
  photo_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT found_device1_pkey PRIMARY KEY (id)
);
CREATE TABLE public.lost_items1 (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  device_name text NOT NULL,
  brand text,
  description text,
  location_lost text,
  photo_url text,
  proof_url text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT lost_items1_pkey PRIMARY KEY (id)
);