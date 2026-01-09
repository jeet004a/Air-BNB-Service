ALTER TABLE "room" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "room_images" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "room" CASCADE;--> statement-breakpoint
DROP TABLE "room_images" CASCADE;--> statement-breakpoint
ALTER TABLE "booking_details" DROP CONSTRAINT "booking_details_room_id_room_id_fk";
--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "price" numeric(10, 2) DEFAULT '0.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "rating" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "reviews" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "type" varchar(100) DEFAULT 'Room' NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "bedrooms" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "beds" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "bathrooms" real DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "amenities" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "highlights" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "hotel" ADD COLUMN "images" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "booking_details" DROP COLUMN "room_id";--> statement-breakpoint
ALTER TABLE "hotel" DROP COLUMN "room_capacity";--> statement-breakpoint
DROP TYPE "public"."room_booked_status_enum";--> statement-breakpoint
DROP TYPE "public"."room_type_enum";