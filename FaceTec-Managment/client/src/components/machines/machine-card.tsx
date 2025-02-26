import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Machine, MachineStatus, Brigade, MachineStatusType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { MachineDialog } from "./machine-dialog";
import { Pencil, Trash2 } from "lucide-react";

interface MachineCardProps {
  machine: Machine;
  brigades: Brigade[];
}

export function MachineCard({ machine, brigades }: MachineCardProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const statusColors: Record<MachineStatusType, string> = {
    [MachineStatus.IN_USE]: "bg-blue-100 text-blue-800",
    [MachineStatus.FREE]: "bg-green-100 text-green-800",
    [MachineStatus.REPAIR]: "bg-red-100 text-red-800",
  };

  const updateStatus = async (status: string) => {
    try {
      setIsUpdating(true);
      await apiRequest("PATCH", `/api/machines/${machine.id}/status`, { status });
      queryClient.invalidateQueries({ queryKey: ["/api/machines"] });
      toast({ title: "Status updated successfully" });
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateBrigade = async (brigadeId: string) => {
    try {
      setIsUpdating(true);
      await apiRequest("PATCH", `/api/machines/${machine.id}/brigade`, {
        brigadeId: brigadeId === "none" ? null : parseInt(brigadeId),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/machines"] });
      toast({ title: "Brigade assignment updated" });
    } catch (error) {
      toast({
        title: "Failed to update brigade",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteMachine = async () => {
    try {
      await apiRequest("DELETE", `/api/machines/${machine.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/machines"] });
      toast({ title: "Machine deleted successfully" });
    } catch (error) {
      toast({
        title: "Failed to delete machine",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{machine.type}</CardTitle>
            <CardDescription>
              {machine.brand} {machine.model}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <MachineDialog
              machine={machine}
              trigger={
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Serial Number</p>
            <p className="text-sm text-muted-foreground">{machine.serialNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Status</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                statusColors[machine.status as MachineStatus]
              }`}
            >
              {machine.status}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Assigned Brigade</p>
            <Select
              disabled={isUpdating}
              value={machine.brigadeId?.toString() || "none"}
              onValueChange={updateBrigade}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {brigades.map((brigade) => (
                  <SelectItem key={brigade.id} value={brigade.id.toString()}>
                    {brigade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating || machine.status === MachineStatus.FREE}
          onClick={() => updateStatus(MachineStatus.FREE)}
        >
          Mark Free
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating || machine.status === MachineStatus.IN_USE}
          onClick={() => updateStatus(MachineStatus.IN_USE)}
        >
          Mark In Use
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isUpdating || machine.status === MachineStatus.REPAIR}
          onClick={() => updateStatus(MachineStatus.REPAIR)}
        >
          Mark For Repair
        </Button>
      </CardFooter>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Machine</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this machine? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteMachine}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}