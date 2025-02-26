import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const MachineStatus = {
  IN_USE: 'in_use',
  FREE: 'free',
  REPAIR: 'repair'
} as const;

export type MachineStatusType = typeof MachineStatus[keyof typeof MachineStatus];

export const machines = pgTable("machines", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  serialNumber: text("serial_number").notNull().unique(),
  status: text("status").$type<MachineStatusType>().notNull(),
  brigadeId: integer("brigade_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const brigades = pgTable("brigades", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  memberCount: integer("member_count").notNull().default(0),
  members: text("members").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workers = pgTable("workers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  startDate: timestamp("start_date").notNull(),
  brigadeId: integer("brigade_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  machineId: integer("machine_id").notNull(),
  prevStatus: text("prev_status").$type<MachineStatusType>(),
  newStatus: text("new_status").$type<MachineStatusType>().notNull(),
  userId: integer("user_id").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
});

export const insertMachineSchema = createInsertSchema(machines).omit({ 
  id: true,
  createdAt: true 
});

export const insertBrigadeSchema = createInsertSchema(brigades).omit({ 
  id: true,
  createdAt: true,
  memberCount: true,
  members: true 
}).extend({
  members: z.array(z.string()).default([])
});

export const insertWorkerSchema = createInsertSchema(workers).omit({
  id: true,
  createdAt: true
}).extend({
  startDate: z.string().transform((str) => new Date(str))
});

export const insertHistorySchema = createInsertSchema(history).omit({ 
  id: true,
  timestamp: true 
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true 
});

export type Machine = typeof machines.$inferSelect;
export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type Brigade = typeof brigades.$inferSelect;
export type InsertBrigade = z.infer<typeof insertBrigadeSchema>;
export type Worker = typeof workers.$inferSelect;
export type InsertWorker = z.infer<typeof insertWorkerSchema>;
export type History = typeof history.$inferSelect;
export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;