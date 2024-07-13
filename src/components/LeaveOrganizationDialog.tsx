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
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  organizationId: string;
};

export default function LeaveOrganizationDialog({ organizationId }: Props) {
  const router = useRouter();

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const onSubmit = async () => {
    setIsButtonLoading(true);
    try {
      const { data } = await axios.delete(`/api/user/${organizationId}`);
      if (data) {
        setIsButtonLoading(false);
        toast({
          title: "Left",
          description: "Organization left successfully",
        });
        router.push("/dashboard");
        window.location.reload();
      }
    } catch (error) {
      setIsButtonLoading(false);
      toast({
        title: "Error",
        description: "Failed to leave organization",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger>
                <LogOut className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Leave Organization</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[425px] max-w-[350px]">
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to leave this organization?
          </DialogTitle>
          <DialogDescription>You will have to re-join this organization to continue using it.</DialogDescription>
        </DialogHeader>
        <Button
          type="button"
          onClick={onSubmit}
          isLoading={isButtonLoading}
          variant="default"
        >
          Leave
        </Button>
      </DialogContent>
    </Dialog>
  );
}
