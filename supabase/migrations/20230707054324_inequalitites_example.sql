create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
);


create table "public"."v2022p1q1" (
    "id" text not null,
    "a" integer not null,
    "b" integer not null,
    "x1" integer not null,
    "y1" integer not null,
    "x2" integer not null,
    "y2" integer not null,
    "x3" integer not null,
    "y3" integer not null,
    "b2" integer not null,
    "og" boolean not null default false,
    "idx" integer not null
);


create table "public"."v_inequalities_example" (
    "id" text not null,
    "a" integer not null,
    "b" integer not null,
    "c" integer not null,
    "d" integer not null,
    "B" integer not null,
    "idx" integer not null,
    "signCase" integer not null,
    "checked" boolean not null default false,
    "flagged" boolean not null default false
);


CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

CREATE UNIQUE INDEX v2022p1q1_idx_key ON public.v2022p1q1 USING btree (idx);

CREATE UNIQUE INDEX v2022p1q1_pkey ON public.v2022p1q1 USING btree (id);

CREATE UNIQUE INDEX v_inequalities_example_idx_key ON public.v_inequalities_example USING btree (idx);

CREATE UNIQUE INDEX v_inequalities_example_pkey ON public.v_inequalities_example USING btree (id);

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";

alter table "public"."v2022p1q1" add constraint "v2022p1q1_pkey" PRIMARY KEY using index "v2022p1q1_pkey";

alter table "public"."v_inequalities_example" add constraint "v_inequalities_example_pkey" PRIMARY KEY using index "v_inequalities_example_pkey";


