import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WorkerCard } from "@/components/workers/worker-card";
import { WorkerDialog } from "@/components/workers/worker-dialog";
import type { Worker, Brigade } from "@shared/schema";
import { Search, Plus } from "lucide-react";

export default function Workers() {
  const [search, setSearch] = useState("");

  const { data: workers = [] } = useQuery<Worker[]>({
    queryKey: ["/api/workers"],
  });

  const { data: brigades = [] } = useQuery<Brigade[]>({
    queryKey: ["/api/brigades"],
  });

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.firstName.toLowerCase().includes(search.toLowerCase()) ||
      worker.lastName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workers</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workers..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <WorkerDialog
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Worker
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkers.map((worker) => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            brigades={brigades}
          />
        ))}
      </div>
    </div>
  );
}
