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
import { insertMachineSchema, MachineStatus } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Machine } from "@shared/schema";

interface MachineDialogProps {
  machine?: Machine;
  trigger: React.ReactNode;
}

export function MachineDialog({ machine, trigger }: MachineDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertMachineSchema),
    defaultValues: machine || {
      type: "",
      brand: "",
      model: "",
      serialNumber: "",
      status: MachineStatus.FREE,
    },
  });

  async function onSubmit(data: any) {
    try {
      if (machine) {
        await apiRequest("PATCH", `/api/machines/${machine.id}`, data);
      } else {
        await apiRequest("POST", "/api/machines", data);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/machines"] });
      toast({ title: `Machine ${machine ? "updated" : "created"} successfully` });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: `Failed to ${machine ? "update" : "create"} machine`,
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
          <DialogTitle>{machine ? "Edit" : "Add"} Machine</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Machine Type</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{machine ? "Update" : "Create"} Machine</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
