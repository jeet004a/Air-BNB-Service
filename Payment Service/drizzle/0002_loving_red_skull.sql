ALTER TABLE "payment" ADD COLUMN "booking_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "payment" ADD CONSTRAINT "payment_booking_id_unique" UNIQUE("booking_id");