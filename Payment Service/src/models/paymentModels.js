import { pgTable, serial, date, integer, pgEnum, timestamp, text } from 'drizzle-orm/pg-core'

export const paymentTypeEnum = pgEnum("room_type_enum", ["pending", "canceled", "completed"]);

export const payment = pgTable('payment', {
    id: serial('id').primaryKey(),
    paymentId: text('payment_id').notNull().unique(),
    bookingId: integer('booking_id').notNull().unique(),
    userId: integer('userId').notNull(),
    hotelId: integer('hotelId').notNull(),
    roomId: integer('roomId').notNull(),
    totalPrice: integer('total_price').notNull(),
    paymentStatus: paymentTypeEnum('payment_status').notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})


export const cancelorder = pgTable('cancelorder', {
    id: serial('id').primaryKey(),
    bookingId: integer('booking_id').notNull().unique(),
    userId: integer('userId').notNull(),
    hotelId: integer('hotelId').notNull(),
    roomId: integer('roomId').notNull(),
    totalPrice: integer('total_price').notNull(),
    paymentStatus: paymentTypeEnum('payment_status').notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})