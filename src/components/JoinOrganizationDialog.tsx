"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ExtendedOrganization } from "@/lib/ExtendedTypes";
import { Role } from "@prisma/client";

type Props = {
  organization: ExtendedOrganization;
  userId: string;
  userAccess: Role
};

var formSchema: any;

export default function JoinOrganizationDialog({ organization, userId, userAccess }: Props) {
  const router = useRouter();

  if (userAccess !== "ADMIN") {
    formSchema = z.object({
      password: z.string().min(6, { message: "Password must be at least 6 numbers." }).max(6, { message: "Password must be at most 6 numbers." }).optional(),
    }).or(z.object({
      password: z.string().optional(),
    }));
  }
  else {
    formSchema = z.object({
      password: z.string().min(6, { message: "Password must be at least 6 numbers." }).max(6, { message: "Password must be at most 6 numbers." }).optional(),
    })
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const payload = {
      classroomId: organization.id,
      userId,
      password: values.password,
    };
    try {
      const { data } = await axios.put(
        `/api/organization/${organization.id}`,
        payload
      );
      if (data) {
        router.push(`/classrooms/${organization.id}`);
        toast({
          title: "Joined",
          description: "Classroom joined successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response.data.error,
        variant: "destructive",
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Join</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[425px] max-w-[350px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to join {organization.name}?
          </DialogTitle>
          <DialogDescription>
            You can join only one organization. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {userAccess !== "ADMIN" && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Ex: 123456" {...field} />
                    </FormControl>
                    <FormDescription>
                      You must enter the organization password to join.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="w-full" isLoading={form.formState.isSubmitting}>Join</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
