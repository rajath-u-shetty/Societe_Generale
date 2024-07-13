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

type Props = {
  organizationId: string;
  projectId: string;
  userName: string | null | undefined;
}

const SOPUploadDialog = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="md:font-semibold text-sm md:block hidden"
          variant="default"
          size="sm"
        >
          Upload SOP
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[700px]"> 
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <SortableDemo />
      </DialogContent>
    </Dialog>
  )
}

export default SOPUploadDialog
