CREATE TABLE "booking_details" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"hotel_id" integer NOT NULL,
	"room_id" integer NOT NULL,
	"check_in" date NOT NULL,
	"chcek_out" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "booking_details_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_hotel_id_hotel_id_fk" FOREIGN KEY ("hotel_id") REFERENCES "public"."hotel"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_room_id_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;