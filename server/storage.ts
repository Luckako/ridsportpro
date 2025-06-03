import { 
  ridingSchools, users, lessons, bookings, messages, progressReports,
  type RidingSchool, type InsertRidingSchool, type User, type InsertUser, 
  type Lesson, type InsertLesson, type Booking, type InsertBooking, 
  type Message, type InsertMessage, type ProgressReport, type InsertProgressReport
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, or } from "drizzle-orm";

export interface IStorage {
  // Riding Schools
  createRidingSchool(school: InsertRidingSchool): Promise<RidingSchool>;
  getRidingSchool(id: number): Promise<RidingSchool | undefined>;
  getRidingSchoolBySubdomain(subdomain: string): Promise<RidingSchool | undefined>;
  getAllRidingSchools(): Promise<RidingSchool[]>;
  updateRidingSchool(id: number, updates: Partial<RidingSchool>): Promise<RidingSchool>;
  
  // Users (tenant-aware)
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(ridingSchoolId?: number): Promise<User[]>;
  getUsersByRidingSchool(ridingSchoolId: number): Promise<User[]>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Lessons (tenant-aware)
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  getLessons(ridingSchoolId?: number): Promise<Lesson[]>;
  getLessonsByTrainer(trainerId: number): Promise<Lesson[]>;
  getAvailableLessons(ridingSchoolId?: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  updateLesson(id: number, updates: Partial<Lesson>): Promise<Lesson>;
  deleteLesson(id: number): Promise<void>;
  
  // Bookings (tenant-aware)
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByRider(riderId: number): Promise<Booking[]>;
  getBookingsByLesson(lessonId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;
  deleteBooking(id: number): Promise<void>;
  
  // Messages (tenant-aware)
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByUser(userId: number): Promise<Message[]>;
  markMessageAsRead(id: number): Promise<Message>;
  getUnreadMessageCount(userId: number): Promise<number>;
  
  // Progress Reports (tenant-aware)
  createProgressReport(report: InsertProgressReport): Promise<ProgressReport>;
  getProgressReportsByRider(riderId: number): Promise<ProgressReport[]>;
  getProgressReportsByTrainer(trainerId: number): Promise<ProgressReport[]>;
}

export class DatabaseStorage implements IStorage {
  // Riding Schools
  async createRidingSchool(school: InsertRidingSchool): Promise<RidingSchool> {
    const [created] = await db.insert(ridingSchools).values(school).returning();
    return created;
  }

  async getRidingSchool(id: number): Promise<RidingSchool | undefined> {
    const [school] = await db.select().from(ridingSchools).where(eq(ridingSchools.id, id));
    return school || undefined;
  }

  async getRidingSchoolBySubdomain(subdomain: string): Promise<RidingSchool | undefined> {
    const [school] = await db.select().from(ridingSchools).where(eq(ridingSchools.subdomain, subdomain));
    return school || undefined;
  }

  async getAllRidingSchools(): Promise<RidingSchool[]> {
    return db.select().from(ridingSchools).where(eq(ridingSchools.active, true));
  }

  async updateRidingSchool(id: number, updates: Partial<RidingSchool>): Promise<RidingSchool> {
    const [updated] = await db.update(ridingSchools)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(ridingSchools.id, id))
      .returning();
    return updated;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(ridingSchoolId?: number): Promise<User[]> {
    if (ridingSchoolId) {
      return await db.select().from(users)
        .where(eq(users.ridingSchoolId, ridingSchoolId))
        .orderBy(desc(users.createdAt));
    }
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUsersByRidingSchool(ridingSchoolId: number): Promise<User[]> {
    return await db.select().from(users)
      .where(eq(users.ridingSchoolId, ridingSchoolId))
      .orderBy(desc(users.createdAt));
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Lessons
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db
      .insert(lessons)
      .values(lesson)
      .returning();
    return newLesson;
  }

  async getLessons(): Promise<Lesson[]> {
    return await db.select().from(lessons).orderBy(lessons.startTime);
  }

  async getLessonsByTrainer(trainerId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.trainerId, trainerId))
      .orderBy(lessons.startTime);
  }

  async getAvailableLessons(): Promise<Lesson[]> {
    const now = new Date();
    return await db
      .select()
      .from(lessons)
      .where(gte(lessons.startTime, now))
      .orderBy(lessons.startTime);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || undefined;
  }

  async updateLesson(id: number, updates: Partial<Lesson>): Promise<Lesson> {
    const [lesson] = await db
      .update(lessons)
      .set(updates)
      .where(eq(lessons.id, id))
      .returning();
    return lesson;
  }

  async deleteLesson(id: number): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  // Bookings
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async getBookingsByRider(riderId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.riderId, riderId))
      .orderBy(desc(bookings.createdAt));
  }

  async getBookingsByLesson(lessonId: number): Promise<Booking[]> {
    return await db
      .select()
      .from(bookings)
      .where(eq(bookings.lessonId, lessonId));
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ status: status as any })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async deleteBooking(id: number): Promise<void> {
    await db.delete(bookings).where(eq(bookings.id, id));
  }

  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getMessagesByUser(userId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));
  }

  async markMessageAsRead(id: number): Promise<Message> {
    const [message] = await db
      .update(messages)
      .set({ read: true })
      .where(eq(messages.id, id))
      .returning();
    return message;
  }

  async getUnreadMessageCount(userId: number): Promise<number> {
    const result = await db
      .select()
      .from(messages)
      .where(and(eq(messages.receiverId, userId), eq(messages.read, false)));
    return result.length;
  }

  // Progress Reports
  async createProgressReport(report: InsertProgressReport): Promise<ProgressReport> {
    const [newReport] = await db
      .insert(progressReports)
      .values(report)
      .returning();
    return newReport;
  }

  async getProgressReportsByRider(riderId: number): Promise<ProgressReport[]> {
    return await db
      .select()
      .from(progressReports)
      .where(eq(progressReports.riderId, riderId))
      .orderBy(desc(progressReports.createdAt));
  }

  async getProgressReportsByTrainer(trainerId: number): Promise<ProgressReport[]> {
    return await db
      .select()
      .from(progressReports)
      .where(eq(progressReports.trainerId, trainerId))
      .orderBy(desc(progressReports.createdAt));
  }
}

export const storage = new DatabaseStorage();
