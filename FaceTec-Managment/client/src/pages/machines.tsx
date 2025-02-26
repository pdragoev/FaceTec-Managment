import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MachineCard } from "@/components/machines/machine-card";
import { MachineDialog } from "@/components/machines/machine-dialog";
import type { Machine, Brigade } from "@shared/schema";
import { Search, Plus } from "lucide-react";

export default function Machines() {
  const [search, setSearch] = useState("");

  const { data: machines = [] } = useQuery<Machine[]>({
    queryKey: ["/api/machines"],
  });

  const { data: brigades = [] } = useQuery<Brigade[]>({
    queryKey: ["/api/brigades"],
  });

  const filteredMachines = machines.filter(
    (machine) =>
      machine.type.toLowerCase().includes(search.toLowerCase()) ||
      machine.brand.toLowerCase().includes(search.toLowerCase()) ||
      machine.model.toLowerCase().includes(search.toLowerCase()) ||
      machine.serialNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Machines</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search machines..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <MachineDialog
            trigger={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Machine
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMachines.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            brigades={brigades}
          />
        ))}
      </div>
    </div>
  );
}