"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { Plus } from "lucide-react";

const formSchema = z.object({
  projectName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

type Props = {
  organizationId: string;
}

export default function CreateProjectDialog({ organizationId }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
    },
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload ={
        organizationId,
        projectName: values.projectName,
      };
      const { data } = await axios.post("/api/project", payload);
      if (data) {
        toast({
          title: "Project created",
          description: `You have successfully created ${data.name}.`,
        });
        router.push(`/organization/${organizationId}/${data.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create project`,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button className="md:font-semibold text-sm md:block hidden" variant="default" size="sm">
            Create Project
          </Button>
          <Button className="font-semibold text-sm md:hidden block" variant="default" size="sm">
            <Plus className="font-black" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="md:max-w-[425px] max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a new project.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Project 1" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be your project name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                isLoading={form.formState.isSubmitting}
                formAction="submit"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
