import { pgTable, serial, varchar, date, timestamp, integer, text } from "drizzle-orm/pg-core";

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  reference: varchar("reference", { length: 24 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  reservationDate: date("reservation_date").notNull(),
  reservationTime: varchar("reservation_time", { length: 5 }).notNull(),
  guests: integer("guests").notNull(),
  notes: text("notes"),
  status: varchar("status", { length: 30 }).notNull().default("in attesa"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
