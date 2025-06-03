import { pgTable, text, serial, integer, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const ridingSchools = pgTable("riding_schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  subdomain: text("subdomain").notNull().unique(), // för att komma åt via subdomain.ridsportpro.se
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  description: text("description"),
  logo: text("logo"), // URL till logga
  primaryColor: text("primary_color").default("#0ea5e9"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  ridingSchoolId: integer("riding_school_id").notNull(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  role: text("role", { enum: ["Ryttare", "Tränare", "Admin"] }).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueEmailPerSchool: unique().on(table.email, table.ridingSchoolId)
}));

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  ridingSchoolId: integer("riding_school_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  trainerId: integer("trainer_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  maxParticipants: integer("max_participants").default(1).notNull(),
  lessonType: text("lesson_type", { enum: ["Hopplektion", "Dressyr", "Terrängridning", "Grundutbildning"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  ridingSchoolId: integer("riding_school_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  riderId: integer("rider_id").notNull(),
  status: text("status", { enum: ["Bekräftad", "Väntande", "Avbokad"] }).default("Bekräftad").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  ridingSchoolId: integer("riding_school_id").notNull(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const progressReports = pgTable("progress_reports", {
  id: serial("id").primaryKey(),
  ridingSchoolId: integer("riding_school_id").notNull(),
  riderId: integer("rider_id").notNull(),
  trainerId: integer("trainer_id").notNull(),
  lessonId: integer("lesson_id"),
  category: text("category", { enum: ["Balans", "Tempo", "Hopp", "Dressyr", "Allmänt"] }).notNull(),
  rating: integer("rating").notNull(), // 1-5 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const ridingSchoolsRelations = relations(ridingSchools, ({ many }) => ({
  users: many(users),
  lessons: many(lessons),
  bookings: many(bookings),
  messages: many(messages),
  progressReports: many(progressReports),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  ridingSchool: one(ridingSchools, {
    fields: [users.ridingSchoolId],
    references: [ridingSchools.id],
  }),
  trainedLessons: many(lessons),
  bookings: many(bookings),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  progressReports: many(progressReports),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  trainer: one(users, {
    fields: [lessons.trainerId],
    references: [users.id],
  }),
  bookings: many(bookings),
  progressReports: many(progressReports),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  lesson: one(lessons, {
    fields: [bookings.lessonId],
    references: [lessons.id],
  }),
  rider: one(users, {
    fields: [bookings.riderId],
    references: [users.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));

export const progressReportsRelations = relations(progressReports, ({ one }) => ({
  rider: one(users, {
    fields: [progressReports.riderId],
    references: [users.id],
  }),
  trainer: one(users, {
    fields: [progressReports.trainerId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [progressReports.lessonId],
    references: [lessons.id],
  }),
}));

// Insert schemas
export const insertRidingSchoolSchema = createInsertSchema(ridingSchools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  ridingSchoolId: true,
  firebaseUid: true,
  email: true,
  name: true,
  phone: true,
  role: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true,
  createdAt: true,
});

export const insertProgressReportSchema = createInsertSchema(progressReports).omit({
  id: true,
  createdAt: true,
});

export const registerUserSchema = z.object({
  ridingSchoolId: z.number().positive("Ridskola måste väljas"),
  name: z.string().min(1, "Namn är obligatoriskt"),
  email: z.string().email("Ogiltig e-postadress"),
  password: z.string().min(6, "Lösenordet måste vara minst 6 tecken"),
  phone: z.string().optional(),
  role: z.enum(["Ryttare", "Tränare", "Admin"], {
    required_error: "Du måste välja en roll",
  }),
});

// Types
export type InsertRidingSchool = z.infer<typeof insertRidingSchoolSchema>;
export type RidingSchool = typeof ridingSchools.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RegisterUser = z.infer<typeof registerUserSchema>;

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertProgressReport = z.infer<typeof insertProgressReportSchema>;
export type ProgressReport = typeof progressReports.$inferSelect;
