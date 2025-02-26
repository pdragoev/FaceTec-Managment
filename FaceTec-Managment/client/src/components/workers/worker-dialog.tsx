import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWorkerSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Worker } from "@shared/schema";

interface WorkerDialogProps {
  worker?: Worker;
  trigger: React.ReactNode;
}

export function WorkerDialog({ worker, trigger }: WorkerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertWorkerSchema),
    defaultValues: {
      firstName: worker?.firstName || "",
      lastName: worker?.lastName || "",
      startDate: worker?.startDate ? new Date(worker.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      brigadeId: worker?.brigadeId || null,
    },
  });

  async function onSubmit(data: any) {
    try {
      // Convert the date string to a proper ISO date string
      const submissionData = {
        ...data,
        startDate: new Date(data.startDate).toISOString()
      };

      if (worker) {
        await apiRequest("PATCH", `/api/workers/${worker.id}`, submissionData);
      } else {
        await apiRequest("POST", "/api/workers", submissionData);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
      toast({ title: `Worker ${worker ? "updated" : "created"} successfully` });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: `Failed to ${worker ? "update" : "create"} worker`,
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{worker ? "Edit" : "Create"} Worker</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {worker ? "Update" : "Create"} Worker
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}