import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRidingSchoolSchema, insertLessonSchema, insertBookingSchema, insertMessageSchema, 
  insertProgressReportSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Riding Schools routes
  app.get("/api/riding-schools", async (req, res) => {
    try {
      const schools = await storage.getAllRidingSchools();
      res.json(schools);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/riding-schools/:id", async (req, res) => {
    try {
      const school = await storage.getRidingSchool(parseInt(req.params.id));
      if (!school) {
        return res.status(404).json({ error: "Riding school not found" });
      }
      res.json(school);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/riding-schools/subdomain/:subdomain", async (req, res) => {
    try {
      const school = await storage.getRidingSchoolBySubdomain(req.params.subdomain);
      if (!school) {
        return res.status(404).json({ error: "Riding school not found" });
      }
      res.json(school);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/riding-schools", async (req, res) => {
    try {
      const validatedData = insertRidingSchoolSchema.parse(req.body);
      const school = await storage.createRidingSchool(validatedData);
      res.status(201).json(school);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/riding-schools/:id", async (req, res) => {
    try {
      const school = await storage.updateRidingSchool(parseInt(req.params.id), req.body);
      res.json(school);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(parseInt(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Lessons routes
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/available", async (req, res) => {
    try {
      const lessons = await storage.getAvailableLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch available lessons" });
    }
  });

  app.get("/api/lessons/trainer/:trainerId", async (req, res) => {
    try {
      const lessons = await storage.getLessonsByTrainer(parseInt(req.params.trainerId));
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trainer lessons" });
    }
  });

  app.post("/api/lessons", async (req, res) => {
    try {
      const validatedData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(validatedData);
      res.status(201).json(lesson);
    } catch (error) {
      res.status(400).json({ error: "Invalid lesson data" });
    }
  });

  app.patch("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.updateLesson(parseInt(req.params.id), req.body);
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ error: "Failed to update lesson" });
    }
  });

  app.delete("/api/lessons/:id", async (req, res) => {
    try {
      await storage.deleteLesson(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete lesson" });
    }
  });

  // Bookings routes
  app.get("/api/bookings/rider/:riderId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByRider(parseInt(req.params.riderId));
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rider bookings" });
    }
  });

  app.get("/api/bookings/lesson/:lessonId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByLesson(parseInt(req.params.lessonId));
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lesson bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: "Invalid booking data" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const booking = await storage.updateBookingStatus(parseInt(req.params.id), status);
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking status" });
    }
  });

  app.delete("/api/bookings/:id", async (req, res) => {
    try {
      await storage.deleteBooking(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete booking" });
    }
  });

  // Messages routes
  app.get("/api/messages/user/:userId", async (req, res) => {
    try {
      const messages = await storage.getMessagesByUser(parseInt(req.params.userId));
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.get("/api/messages/unread/:userId", async (req, res) => {
    try {
      const count = await storage.getUnreadMessageCount(parseInt(req.params.userId));
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  app.patch("/api/messages/:id/read", async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(parseInt(req.params.id));
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark message as read" });
    }
  });

  // Progress reports routes
  app.get("/api/progress/rider/:riderId", async (req, res) => {
    try {
      const reports = await storage.getProgressReportsByRider(parseInt(req.params.riderId));
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress reports" });
    }
  });

  app.get("/api/progress/trainer/:trainerId", async (req, res) => {
    try {
      const reports = await storage.getProgressReportsByTrainer(parseInt(req.params.trainerId));
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trainer progress reports" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const validatedData = insertProgressReportSchema.parse(req.body);
      const report = await storage.createProgressReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress report data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
