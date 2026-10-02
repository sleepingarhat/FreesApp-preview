create table users (
  user_id bigint primary key generated always as identity,
  phone_number varchar(20) not null unique,
  display_name varchar(50) not null,
  device_uuid varchar(255) not null,
  give_exp int not null default 0,
  give_level smallint not null default 1,
  take_exp int not null default 0,
  take_level smallint not null default 1,
  integrity_score smallint not null default 100,
  has_rookie_medal boolean not null default true,
  total_give_count int not null default 0,
  total_take_count int not null default 0,
  strike_count smallint not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now()
);
create table items (
  item_id bigint primary key generated always as identity,
  giver_id bigint not null references users(user_id),
  title varchar(100) not null,
  description text,
  image_urls jsonb not null,
  is_high_value boolean not null default false,
  min_give_level smallint not null default 1,
  min_integrity smallint not null default 0,
  district varchar(20) not null,
  area varchar(20),
  status text not null default 'available',
  created_at timestamptz not null default now()
);
create table item_applications (
  application_id bigint primary key generated always as identity,
  item_id bigint not null references items(item_id),
  applicant_id bigint not null references users(user_id),
  reason varchar(255),
  status text not null default 'pending',
  applied_at timestamptz not null default now()
);
create table transactions (
  tx_id bigint primary key generated always as identity,
  item_id bigint not null references items(item_id),
  giver_id bigint not null references users(user_id),
  taker_id bigint not null references users(user_id),
  mtr_station varchar(50),
  exact_location varchar(100),
  appointment_time timestamptz,
  tx_status text not null default 'chatting',
  dynamic_code char(3),
  giver_checked_in boolean not null default false,
  taker_checked_in boolean not null default false
);
create table disputes (
  dispute_id bigint primary key generated always as identity,
  tx_id bigint not null references transactions(tx_id),
  reporter_id bigint not null references users(user_id),
  reported_id bigint not null references users(user_id),
  dynamic_code char(3) not null,
  proof_image_url varchar(255),
  proof_latitude numeric(10,8),
  proof_longitude numeric(11,8),
  final_verdict text not null default 'pending'
);
create table user_tags (
  user_id bigint not null references users(user_id),
  tag_name varchar(30) not null,
  count int not null default 0,
  primary key (user_id, tag_name)
);
