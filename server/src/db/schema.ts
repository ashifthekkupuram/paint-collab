import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 55 }).unique().notNull(),
  email: varchar("email", { length: 254 }).unique().notNull(),
  password: varchar("password").notNull(),
  ...timestamps,
});
