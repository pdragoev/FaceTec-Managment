import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMachineSchema, insertBrigadeSchema, insertWorkerSchema, MachineStatus } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Machines
  app.get("/api/machines", async (_req, res) => {
    const machines = await storage.getMachines();
    res.json(machines);
  });

  app.post("/api/machines", async (req, res) => {
    const result = insertMachineSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const machine = await storage.createMachine(result.data);
    res.json(machine);
  });

  app.patch("/api/machines/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertMachineSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const machine = await storage.updateMachine(id, result.data);
    res.json(machine);
  });

  app.delete("/api/machines/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteMachine(id);
    res.status(204).end();
  });

  app.patch("/api/machines/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    const status = z.enum([MachineStatus.FREE, MachineStatus.IN_USE, MachineStatus.REPAIR])
      .parse(req.body.status);
    const userId = 1; // TODO: Get from session

    const machine = await storage.updateMachineStatus(id, status, userId);
    res.json(machine);
  });

  app.patch("/api/machines/:id/brigade", async (req, res) => {
    const id = parseInt(req.params.id);
    const brigadeId = req.body.brigadeId ? parseInt(req.body.brigadeId) : null;

    const machine = await storage.updateMachineBrigade(id, brigadeId);
    res.json(machine);
  });

  // Workers
  app.get("/api/workers", async (_req, res) => {
    const workers = await storage.getWorkers();
    res.json(workers);
  });

  app.post("/api/workers", async (req, res) => {
    const result = insertWorkerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const worker = await storage.createWorker(result.data);
    res.json(worker);
  });

  app.patch("/api/workers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertWorkerSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const worker = await storage.updateWorker(id, result.data);
    res.json(worker);
  });

  app.delete("/api/workers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteWorker(id);
    res.status(204).end();
  });

  // Brigades
  app.get("/api/brigades", async (_req, res) => {
    const brigades = await storage.getBrigades();
    res.json(brigades);
  });

  app.post("/api/brigades", async (req, res) => {
    const result = insertBrigadeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const brigade = await storage.createBrigade(result.data);
    res.json(brigade);
  });

  app.patch("/api/brigades/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = insertBrigadeSchema.partial().safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const brigade = await storage.updateBrigade(id, result.data);
    res.json(brigade);
  });

  app.delete("/api/brigades/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteBrigade(id);
    res.status(204).end();
  });

  app.get("/api/machines/:id/history", async (req, res) => {
    const id = parseInt(req.params.id);
    const history = await storage.getMachineHistory(id);
    res.json(history);
  });

  const httpServer = createServer(app);
  return httpServer;
}