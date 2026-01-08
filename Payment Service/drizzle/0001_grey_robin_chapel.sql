CREATE TABLE "payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"payment_id" text NOT NULL,
	"userId" integer NOT NULL,
	"hotelId" integer NOT NULL,
	"roomId" integer NOT NULL,
	"total_price" integer NOT NULL,
	"payment_status" "room_type_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payment_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
DROP TABLE "bookings" CASCADE;