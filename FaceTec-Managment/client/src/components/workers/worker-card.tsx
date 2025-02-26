import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Worker, Brigade } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { WorkerDialog } from "./worker-dialog";
import { Calendar, Briefcase, Pencil, Trash2 } from "lucide-react";

interface WorkerCardProps {
  worker: Worker;
  brigades: Brigade[];
}

export function WorkerCard({ worker, brigades }: WorkerCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const assignedBrigade = brigades.find((b) => b.id === worker.brigadeId);

  const deleteWorker = async () => {
    try {
      await apiRequest("DELETE", `/api/workers/${worker.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
      toast({ title: "Worker deleted successfully" });
    } catch (error) {
      toast({
        title: "Failed to delete worker",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const updateBrigade = async (brigadeId: string) => {
    try {
      await apiRequest("PATCH", `/api/workers/${worker.id}`, {
        brigadeId: brigadeId === "none" ? null : parseInt(brigadeId),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
      toast({ title: "Brigade assignment updated" });
    } catch (error) {
      toast({
        title: "Failed to update brigade assignment",
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
            <CardTitle>{`${worker.firstName} ${worker.lastName}`}</CardTitle>
            <CardDescription>
              Started {new Date(worker.startDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <WorkerDialog
              worker={worker}
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
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {new Date(worker.startDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Assigned Brigade</span>
            </div>
            <Select
              value={worker.brigadeId?.toString() || "none"}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Worker</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this worker? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteWorker}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
