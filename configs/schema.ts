import {pgTable, date, uuid, text, json, timestamp, varchar, integer, boolean} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userName: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    avatarUrl: varchar(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    isPremium: integer().default(0),
    stripeCustomerId: varchar()
});


export const projectsTable = pgTable("projects", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: varchar().notNull(),
    userInput: varchar(),
    device: varchar(),
    createdOn: date().defaultNow(),
    config: json(),
    createdBy: varchar().references(() => usersTable.email).notNull(),
    projectName: varchar(),
    theme: varchar(),
    projectVisualDescription: varchar(),
    screenCount: integer().default(4),
    screenShot: json(),
    apiKey: varchar()



})

export const screenConfigsTable = pgTable("screenConfigs", {
    id: integer().primaryKey().notNull().generatedAlwaysAsIdentity(),
    projectId: varchar().notNull(),
    screenId: varchar(),
    screenName: varchar(),
    purpose: varchar(),
    code: text(),
    screenDescription: varchar(),
    theme: varchar(),
})

