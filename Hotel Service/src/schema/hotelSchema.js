import { pgTable, serial, varchar, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core'

export const manager = pgTable('manager', {
    id: serial('id').primaryKey(),
    name: varchar('firstname', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password').notNull(),
    salt: varchar('salt').notNull(),
    phone: varchar('phone', { length: 15 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})

export const hotel = pgTable('hotel', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: varchar('description', { length: 255 }).notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    city: varchar('city', { length: 255 }).notNull(),
    country: varchar('country', { length: 255 }).notNull(),
    pincode: varchar('pincode', { length: 10 }).notNull(),
    roomCapacity: integer('room_capacity').notNull().default(0),
    hostId: integer('host_id').references(() => manager.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})

// Define the enum for room type
export const roomTypeEnum = pgEnum("room_type_enum", ["single", "double", "family"]);

export const room = pgTable('room', {
    id: serial('id').primaryKey(),
    hotelId: integer('hotel_id').references(() => hotel.id, { onDelete: 'cascade' }).notNull(),
    roomType: roomTypeEnum('room_type').notNull(),
    PPN: integer('ppn').notNull(),
    max_guests: integer('max_guests').notNull(),
    description: text('description').notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})

export const roomImages = pgTable('room_images', {
    id: serial('id').primaryKey(),
    roomId: integer('room_id').references(() => room.id, { onDelete: 'cascade' }).notNull(),
    imageUrl: varchar('image_url', { length: 255 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})