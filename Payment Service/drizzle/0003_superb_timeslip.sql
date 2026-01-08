CREATE TABLE "cancelorder" (
	"id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"userId" integer NOT NULL,
	"hotelId" integer NOT NULL,
	"roomId" integer NOT NULL,
	"total_price" integer NOT NULL,
	"payment_status" "room_type_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cancelorder_booking_id_unique" UNIQUE("booking_id")
);
