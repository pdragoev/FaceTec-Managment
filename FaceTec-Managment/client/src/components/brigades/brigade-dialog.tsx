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
import { insertBrigadeSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Brigade } from "@shared/schema";

interface BrigadeDialogProps {
  brigade?: Brigade;
  trigger: React.ReactNode;
}

export function BrigadeDialog({ brigade, trigger }: BrigadeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertBrigadeSchema),
    defaultValues: {
      name: brigade?.name || "",
    },
  });

  async function onSubmit(data: any) {
    try {
      const payload = {
        name: data.name,
        members: [],
        memberCount: 0
      };

      if (brigade) {
        await apiRequest("PATCH", `/api/brigades/${brigade.id}`, payload);
      } else {
        await apiRequest("POST", "/api/brigades", payload);
      }

      queryClient.invalidateQueries({ queryKey: ["/api/brigades"] });
      toast({ title: `Brigade ${brigade ? "updated" : "created"} successfully` });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: `Failed to ${brigade ? "update" : "create"} brigade`,
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
          <DialogTitle>{brigade ? "Edit" : "Create"} Brigade</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brigade Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {brigade ? "Update" : "Create"} Brigade
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}