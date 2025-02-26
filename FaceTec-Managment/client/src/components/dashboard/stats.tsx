import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Machine, MachineStatus } from "@shared/schema";

interface StatsProps {
  machines: Machine[];
}

export function Stats({ machines }: StatsProps) {
  const stats = {
    total: machines.length,
    inUse: machines.filter((m) => m.status === MachineStatus.IN_USE).length,
    free: machines.filter((m) => m.status === MachineStatus.FREE).length,
    repair: machines.filter((m) => m.status === MachineStatus.REPAIR).length,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Machines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">In Use</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.inUse}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Free</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.free}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Under Repair</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.repair}</div>
        </CardContent>
      </Card>
    </div>
  );
}
