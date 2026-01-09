import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const User = pgTable('users', {
    id: serial('id').primaryKey(),
    firstname: varchar('firstname', { length: 255 }).notNull(),
    lastname: varchar('lastname', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    profileImage: varchar('profile_image', { length: 500 }).default('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=60'),
    password: varchar('password').notNull(),
    salt: varchar('salt').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
})