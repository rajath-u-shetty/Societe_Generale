"use client"
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import SortableDemo from './SortableDemo';
import { useSOPStore } from '@/lib/stores/useSOP';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

type Props = {
  organizationId: string;
  projectId: string;
  userName: string | null | undefined;
}

const SOPUploadDialog = ({ projectId, organizationId }: Props) => {
  const SopItems = useSOPStore((state) => state.SOPItems);
  const regulationsText = useSOPStore((state) => state.regulationsText);
  const name = useSOPStore((state) => state.SOPName);
  const [isOpen, setIsOpen] = React.useState(false);

  const { mutate: mutateSOP, isPending } = useMutation({
    mutationFn: async () => {
      const payload = { regulationsText, sopItems: SopItems, name }
      const { data } = await axios.post("/api/chat", payload)
      console.log("data", data.text);
      return data.text
    },
    onSuccess: async (data) => {
      await axios.post("/api/project/sop", { projectId, organizationId, sopText: data, name })
      setIsOpen(false)
    },
  })
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="md:font-semibold text-sm md:block hidden"
          variant="default"
          size="sm"
        >
          Upload SOP
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[600px] max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="leading-relaxed">Add Items and arrange them in the order you want to create a SOP</DialogTitle>
        </DialogHeader>
        <SortableDemo />
        <Button isLoading={isPending} className="w-[130px]" onClick={() => mutateSOP()}>Publish</Button>
      </DialogContent>
    </Dialog>
  )
}

export default SOPUploadDialog
