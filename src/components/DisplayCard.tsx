'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { cn } from '@/lib/utils';
import { actionApproveSOP, actionRejectSOP } from '@/app/(app)/_actions/userActions';
import { toast } from 'sonner';

const ContentDisplayCard = ({ data }: { data: any }) => {
  const content = JSON.parse(data.content);
  const aiContent = JSON.parse(data.aiContent);
  const [isOpen, setIsOpen] = useState(true);
  const [isApprovedLoading, setIsApprovedLoading] = useState(false);
  const [isRejectedLoading, setIsRejectedLoading] = useState(false);

  // Convert array to string with each element on a new line
  const contentString = content.map((item: any) => item.name).join('\n');
  const aiContentString = aiContent.map((item: any) => item.name).join('\n');

  const handleApprove = async () => {
    setIsApprovedLoading(true);
    await actionApproveSOP(data.id);
    toast.success('SOP Approved');
    setIsApprovedLoading(false);
  }
  const handleReject = async () => {
    setIsRejectedLoading(true);
    await actionRejectSOP(data.id);
    toast.success('SOP Rejected');
    setIsRejectedLoading(false);
  }

  console.log(data);

  return (
    <Dialog>
      <DialogTrigger>
        <div className={cn(`cursor-pointer border rounded-xl`, data.approved ? 'border-white' : 'border-red-500')}>
          <Card className="flex flex-col items-start justify-start p-8 rounded-xl dark:bg-[rgb(17,17,17)]/100">
            <div className="flex justify-between gap-4 w-full">
              <h1 className="text-xl font-bold">{data.name ? data.name : data.project.name}</h1>
              <Badge variant="secondary" className="text-sm">
                Score: {data.AiScore}
              </Badge>
            </div>
            <h1 className="text-base">
              Created by: {data.createdBy.name}
            </h1>
          </Card>
        </div>
      </DialogTrigger>
      <DialogContent className='min-w-[1100px] h-[80vh] overflow-y-auto'>
        <div>
          <CardHeader className="">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-2 items-center">
                <h2 className="text-2xl font-bold">Content Display</h2>
                <Badge variant="secondary" className="text-lg">
                  Score: {data.AiScore}
                </Badge>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => setIsOpen(prev => !prev)}
                  variant="default"
                  className="text-sm w-28"
                >
                  {isOpen ? 'Diff View' : 'Original View'}
                </Button>
                {data.approved ? (<Button onClick={handleReject} isLoading={isRejectedLoading}>Reject</Button>) : (<Button onClick={handleApprove} isLoading={isApprovedLoading}>Approve</Button>)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className='pb-6 pt-3'>{data.description ? data.description : 'No description provided'}</p>
            {isOpen ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Original Content</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {content.map((item: any) => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Content</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {aiContent.map((item: any) => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <ReactDiffViewer
                oldValue={contentString}
                newValue={aiContentString}
                useDarkTheme={true}
                compareMethod={DiffMethod.WORDS}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-gray-500">
            <span>Created by: {data.createdBy.name}</span>
            <span>Created at: {new Date(data.createdAt).toLocaleString()}</span>
          </CardFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDisplayCard;

