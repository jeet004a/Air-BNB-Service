import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const User = pgTable('users', {
    id: serial('id').primaryKey(),
    firstname: varchar('firstname', { length: 255 }).notNull(),
    lastname: varchar('lastname', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password').notNull(),
    salt: varchar('salt').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
})