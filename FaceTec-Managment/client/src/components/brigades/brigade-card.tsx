import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Brigade, Machine } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { BrigadeDialog } from "./brigade-dialog";
import { Pencil, Trash2, Users } from "lucide-react";

interface BrigadeCardProps {
  brigade: Brigade;
  machines: Machine[];
}

export function BrigadeCard({ brigade, machines }: BrigadeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const assignedMachines = machines.filter((m) => m.brigadeId === brigade.id);

  const deleteBrigade = async () => {
    try {
      await apiRequest("DELETE", `/api/brigades/${brigade.id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/brigades"] });
      toast({ title: "Brigade deleted successfully" });
    } catch (error) {
      toast({
        title: "Failed to delete brigade",
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
            <CardTitle>{brigade.name}</CardTitle>
            <CardDescription>
              Created {new Date(brigade.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <BrigadeDialog
              brigade={brigade}
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
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <p className="text-sm font-medium">Members ({brigade.memberCount})</p>
            </div>
            <div className="mt-2 space-y-1">
              {brigade.members.map((member, index) => (
                <div key={index} className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  {member}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Assigned Machines</p>
            <p className="text-2xl font-bold">{assignedMachines.length}</p>
          </div>
          {assignedMachines.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Machine List</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {assignedMachines.map((machine) => (
                  <li key={machine.id}>
                    {machine.type} - {machine.brand} {machine.model}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Brigade</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this brigade? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteBrigade}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}