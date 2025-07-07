import { pgTable, serial, date, integer, pgEnum, timestamp } from 'drizzle-orm/pg-core'

export const paymentTypeEnum = pgEnum("room_type_enum", ["pending", "canceled", "completed"]);

export const bookings = pgTable('bookings', {
    id: serial('id').primaryKey(),
    userId: integer('userId').notNull(),
    hotelId: integer('hotelId').notNull(),
    roomId: integer('roomId').notNull(),
    checkIn: date('check_in').notNull(),
    checkOut: date('chcek_out').notNull(),
    totalPrice: integer('total_price').notNull(),
    paymentStatus: paymentTypeEnum('payment_status').notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})