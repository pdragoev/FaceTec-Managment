import { useQuery } from "@tanstack/react-query";
import { Stats } from "@/components/dashboard/stats";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Machine, Brigade } from "@shared/schema";

export default function Dashboard() {
  const { data: machines = [] } = useQuery<Machine[]>({
    queryKey: ["/api/machines"],
  });

  const { data: brigades = [] } = useQuery<Brigade[]>({
    queryKey: ["/api/brigades"],
  });

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Machine
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Brigade
          </Button>
        </div>
      </div>

      <Stats machines={machines} />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {/* Add recent activity component here */}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Brigade Overview</h2>
          <div className="space-y-2">
            {brigades.map((brigade) => (
              <div
                key={brigade.id}
                className="p-4 rounded-lg border bg-card text-card-foreground"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{brigade.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {brigade.memberCount} members
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
