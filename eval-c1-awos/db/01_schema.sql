CREATE TABLE "customers" (
  "id" SMALLSERIAL PRIMARY KEY,
  "name" varchar(40),
  "email" varchar(40)
);

CREATE TABLE "status" (
  "id" SMALLSERIAL PRIMARY KEY,
  "name" varchar(20)
);

CREATE TABLE "categories" (
  "id" SMALLSERIAL PRIMARY KEY,
  "name" varchar(20)
);

CREATE TABLE "p_methods" (
  "id" SMALLSERIAL PRIMARY KEY,
  "name" varchar(50)
);

CREATE TABLE "products" (
  "id" SMALLSERIAL PRIMARY KEY,
  "name" varchar(100),
  "category_id" int,
  "stock" int,
  "active" boolean DEFAULT true,
  FOREIGN KEY ("category_id") REFERENCES "categories" ("id")
);

CREATE TABLE "orders" (
  "id" SMALLSERIAL PRIMARY KEY,
  "id_customer" int,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "status" int,
  FOREIGN KEY ("id_customer") REFERENCES "customers" ("id"),
  FOREIGN KEY ("status") REFERENCES "status" ("id")
);

CREATE TABLE "order_items" (
  "id" SMALLSERIAL PRIMARY KEY,
  "order_id" int,
  "product_id" int,
  "qty" int,
  "price" int,
  FOREIGN KEY ("order_id") REFERENCES "orders" ("id"),
  FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

CREATE TABLE "payments" (
  "id" SMALLSERIAL PRIMARY KEY,
  "order_id" int,
  "method_id" int,
  "amount" int,
  FOREIGN KEY ("order_id") REFERENCES "orders" ("id"),
  FOREIGN KEY ("method_id") REFERENCES "p_methods" ("id")
);
