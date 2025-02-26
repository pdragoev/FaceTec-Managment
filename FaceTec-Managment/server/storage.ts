import { 
  Machine, InsertMachine, 
  Brigade, InsertBrigade,
  Worker, InsertWorker,
  History, InsertHistory,
  User, InsertUser,
  MachineStatus,
  type MachineStatusType
} from "@shared/schema";

export interface IStorage {
  // Machines
  getMachines(): Promise<Machine[]>;
  getMachine(id: number): Promise<Machine | undefined>;
  createMachine(machine: InsertMachine): Promise<Machine>;
  updateMachine(id: number, machine: Partial<InsertMachine>): Promise<Machine>;
  deleteMachine(id: number): Promise<void>;
  updateMachineStatus(id: number, status: MachineStatusType, userId: number): Promise<Machine>;
  updateMachineBrigade(id: number, brigadeId: number | null): Promise<Machine>;

  // Brigades
  getBrigades(): Promise<Brigade[]>;
  getBrigade(id: number): Promise<Brigade | undefined>;
  createBrigade(brigade: InsertBrigade): Promise<Brigade>;
  updateBrigade(id: number, brigade: Partial<InsertBrigade>): Promise<Brigade>;
  deleteBrigade(id: number): Promise<void>;

  // Workers
  getWorkers(): Promise<Worker[]>;
  getWorker(id: number): Promise<Worker | undefined>;
  createWorker(worker: InsertWorker): Promise<Worker>;
  updateWorker(id: number, worker: Partial<InsertWorker>): Promise<Worker>;
  deleteWorker(id: number): Promise<void>;

  // History
  getMachineHistory(machineId: number): Promise<History[]>;
  createHistory(history: InsertHistory): Promise<History>;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private machines: Map<number, Machine>;
  private brigades: Map<number, Brigade>;
  private workers: Map<number, Worker>;
  private history: Map<number, History>;
  private users: Map<number, User>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.machines = new Map();
    this.brigades = new Map();
    this.workers = new Map();
    this.history = new Map();
    this.users = new Map();
    this.currentIds = {
      machines: 1,
      brigades: 1,
      workers: 1,
      history: 1,
      users: 1
    };
  }

  async getMachines(): Promise<Machine[]> {
    return Array.from(this.machines.values());
  }

  async getMachine(id: number): Promise<Machine | undefined> {
    return this.machines.get(id);
  }

  async createMachine(machine: InsertMachine): Promise<Machine> {
    const id = this.currentIds.machines++;
    const newMachine = { 
      ...machine, 
      id, 
      createdAt: new Date() 
    };
    this.machines.set(id, newMachine as Machine);
    return newMachine as Machine;
  }

  async updateMachine(id: number, update: Partial<InsertMachine>): Promise<Machine> {
    const machine = await this.getMachine(id);
    if (!machine) throw new Error("Machine not found");

    const updatedMachine = { ...machine, ...update };
    this.machines.set(id, updatedMachine);
    return updatedMachine;
  }

  async deleteMachine(id: number): Promise<void> {
    if (!this.machines.has(id)) throw new Error("Machine not found");
    this.machines.delete(id);
  }

  async updateMachineStatus(id: number, status: MachineStatusType, userId: number): Promise<Machine> {
    const machine = await this.getMachine(id);
    if (!machine) throw new Error("Machine not found");

    const prevStatus = machine.status;
    const updatedMachine = { ...machine, status };
    this.machines.set(id, updatedMachine);

    // Create history entry
    await this.createHistory({
      machineId: id,
      prevStatus,
      newStatus: status,
      userId
    });

    return updatedMachine;
  }

  async updateMachineBrigade(id: number, brigadeId: number | null): Promise<Machine> {
    const machine = await this.getMachine(id);
    if (!machine) throw new Error("Machine not found");

    const updatedMachine = { ...machine, brigadeId };
    this.machines.set(id, updatedMachine);
    return updatedMachine;
  }

  async getBrigades(): Promise<Brigade[]> {
    return Array.from(this.brigades.values());
  }

  async getBrigade(id: number): Promise<Brigade | undefined> {
    return this.brigades.get(id);
  }

  async createBrigade(brigade: InsertBrigade): Promise<Brigade> {
    const id = this.currentIds.brigades++;
    const newBrigade = { 
      ...brigade, 
      id, 
      createdAt: new Date(),
      memberCount: brigade.members.length 
    };
    this.brigades.set(id, newBrigade);
    return newBrigade;
  }

  async updateBrigade(id: number, update: Partial<InsertBrigade>): Promise<Brigade> {
    const brigade = await this.getBrigade(id);
    if (!brigade) throw new Error("Brigade not found");

    const updatedBrigade = { 
      ...brigade, 
      ...update,
      memberCount: update.members ? update.members.length : brigade.memberCount 
    };
    this.brigades.set(id, updatedBrigade);
    return updatedBrigade;
  }

  async deleteBrigade(id: number): Promise<void> {
    if (!this.brigades.has(id)) throw new Error("Brigade not found");
    this.brigades.delete(id);
  }

  async getMachineHistory(machineId: number): Promise<History[]> {
    return Array.from(this.history.values())
      .filter(h => h.machineId === machineId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createHistory(history: InsertHistory): Promise<History> {
    const id = this.currentIds.history++;
    const newHistory = {
      ...history,
      id,
      timestamp: new Date()
    };
    this.history.set(id, newHistory);
    return newHistory;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const newUser = { ...user, id };
    if (newUser.isAdmin === undefined) {
      newUser.isAdmin = false;
    }
    this.users.set(id, newUser as User);
    return newUser as User;
  }

  async getWorkers(): Promise<Worker[]> {
    return Array.from(this.workers.values());
  }

  async getWorker(id: number): Promise<Worker | undefined> {
    return this.workers.get(id);
  }

  async createWorker(worker: InsertWorker): Promise<Worker> {
    const id = this.currentIds.workers++;
    const newWorker = {
      ...worker,
      id,
      createdAt: new Date()
    };
    this.workers.set(id, newWorker);
    return newWorker;
  }

  async updateWorker(id: number, update: Partial<InsertWorker>): Promise<Worker> {
    const worker = await this.getWorker(id);
    if (!worker) throw new Error("Worker not found");

    const updatedWorker = { ...worker, ...update };
    this.workers.set(id, updatedWorker);
    return updatedWorker;
  }

  async deleteWorker(id: number): Promise<void> {
    if (!this.workers.has(id)) throw new Error("Worker not found");
    this.workers.delete(id);
  }
}

export const storage = new MemStorage();