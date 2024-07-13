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
import { toast } from "./ui/use-toast";
import { Trash } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  organizationId: string;
};

export default function DeleteOrganizationDialog({ organizationId }: Props) {
  const router = useRouter()
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const onSubmit = async () => {
    try {
      setIsButtonLoading(true);
      const { data } = await axios.delete(`/api/organization/${organizationId}`);
      if (data) {
        toast({
          title: "Deleted",
          description: "Organization deleted successfully",
        });
        // Set a timeout for 1 second before reloading the page
        setTimeout(() => {
          setIsButtonLoading(false);
          router.push("/dashboard")
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      setIsButtonLoading(false);
      toast({
        title: "Error",
        description: "Failed to delete organization",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent  className="md:max-w-[425px] max-w-[350px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this organization?
          </DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <Button type="button" onClick={onSubmit} isLoading={isButtonLoading} variant="default">
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}
