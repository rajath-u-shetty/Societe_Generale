import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

const ContentDisplayCard = ({ data }: { data: any }) => {
  const content = JSON.parse(data.content);
  const aiContent = JSON.parse(data.aiContent);

  return (
    <Dialog>
      <DialogTrigger>
        <div
          className="cursor-pointer border-white border rounded-xl"
        >
          <Card className="flex flex-col items-start justify-start p-8 rounded-xl dark:bg-[rgb(17,17,17)]/100">
            <h1 className="text-xl font-bold">{data.name ? data.name : data.project.name}</h1>
            <h1 className="text-base">
              Created by: {data.createdBy.name}
            </h1>
          </Card>
        </div>
      </DialogTrigger>
      <DialogContent className='min-w-[1100px] h-[80vh] overflow-y-auto'>
        <div>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Content Display</h2>
            <Badge variant="secondary" className="text-lg">
              Score: {data.AiScore}
            </Badge>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
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
