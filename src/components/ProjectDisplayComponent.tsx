
"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = {
  organizationId: string;
  projectId: string;
  userName: string | null | undefined;
  userAccess: Role;
  userId: string;
  organizationName: string;
  projectName: string;
}
type ExtendedSOP = {
  id: string;
  title: string;
  content: string;
  aiContent: string;
  projectId: string;
  project: Project;
  createdById: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectDisplayComponent = ({
  projectName,
  organizationName,
  userId,
  userAccess,
  userName,
  projectId,
  organizationId,
}: Props) => {
  const router = useRouter();
  const { data: sops, isError } = useQuery({
    queryKey: ["sops"],
    queryFn: async () => {
      try {
        const data = await actionFetchProjectSOPs(projectId).catch(error => {
          console.log("error", error);
          router.push("/dashboard");
          return { error: "Failed to fetch project SOPs", data: null };
        });
        if (data.error) {
          router.push("/dashboard");
          toast({ title: "Error", description: data?.error, variant: "destructive" });
        }
        return data.data!.sops as ExtendedSOP[];
      } catch (error: any) {
        if (
          error.response.status === 401 ||
          error.response.data === "User is not a member"
        ) {
          toast({
            description:
              "You are not authorized to access this classroom. Join the classroom to access it.",
            variant: "destructive",
          });
          router.push(`/dashboard`);
        }
      }
    },
    refetchIntervalInBackground: true,
    refetchInterval: 1000,
  });

  const [filteredSOPs, setFilteredSOPs] = React.useState<ExtendedSOP[] | null>(
    null
  );
  const [searchStarted, setSearchStarted] = React.useState(false);

  useEffect(() => {
    setFilteredSOPs(sops!);
  }, [sops]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="md:text-xl md:font-semibold text-lg font-medium">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="md:text-xl md:font-semibold text-lg font-medium">
              <BreadcrumbLink href={`/organization/${organizationId}`}>
                {organizationName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="md:text-xl md:font-semibold text-lg font-medium">
              <BreadcrumbPage>{projectName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <Separator />
      <div className="flex items-center gap-2.5 pt-10 pb-6 justify-between">
        <Input
          className="flex-1 dark:bg-[rgb(23,23,23)] bg-neutral-200"
          placeholder="Start typing to search..."
          onChange={(e) => {
            setSearchStarted(true);
            setFilteredSOPs(
              sops?.filter(
                (sop) =>
                  sop.title
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase()) ||
                  sop.content
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
              ) || null
            );
          }}
        />
        {userAccess !== "USER" && (
          <SOPUploadDialog
            projectId={projectId}
            organizationId={organizationId}
            userName={userName}
          />
        )}
      </div>

      {isError ? (
        <ErrorAlert />
      ) : (searchStarted && filteredSOPs && filteredSOPs.length === 0) ||
        sops?.length === 0 ? (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Image
            alt="an image of a picture and directory icon"
            width="300"
            height="300"
            src="/empty.svg"
          />
          <div className="text-2xl text-center">
            No SOPs uploaded. Please come back later
          </div>
        </div>
      ) : filteredSOPs && filteredSOPs.length > 0 ? (
        <div></div>
      ) : searchStarted ? (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Image
            alt="an image of a picture and directory icon"
            width="300"
            height="300"
            src="/empty.svg"
          />
          <div className="text-2xl text-center">
            No SOPs uploaded. Please come back later
          </div>
        </div>
      ) : (
        <LoadingState />
      )}
    </div>
  );
};

export default ProjectDisplayComponent;


import { Skeleton, SVGSkeleton } from "@/components/ui/skeleton";
import { ErrorAlert } from "./ErrorAlert";
import { actionFetchProjectSOPs } from "@/app/(app)/_actions/userActions";
import { Project, Role, User } from "@prisma/client";
import { Input } from "./ui/input";
import SOPUploadDialog from "./SOPUploadDialog";

const LoadingSkeleton = () => (
  <>
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom">
        <thead className="[&amp;_tr]:border-b">
          <tr className="border-b transition-colors">
            <th className="h-12 px-4 text-left align-middle [&amp;:has([role=checkbox])]:pr-0 w-1/2">
              <Skeleton className="w-[32px] max-w-full" />
            </th>
            <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[32px] max-w-full" />
            </th>
            <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[88px] max-w-full" />
            </th>
            <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[64px] max-w-full" />
            </th>
          </tr>
        </thead>
        <tbody className="[&amp;_tr:last-child]:border-0">
          <tr className="border-b transition-colors">
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 w-1/2">
              <Skeleton className="w-[176px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[96px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[48px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <a className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2 w-fit">
                <SVGSkeleton className="w-[24px] h-[24px]" />
              </a>
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"></td>
          </tr>
          <tr className="border-b transition-colors">
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 w-1/2">
              <Skeleton className="w-[112px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[96px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[48px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <a className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2 w-fit">
                <SVGSkeleton className="w-[24px] h-[24px]" />
              </a>
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"></td>
          </tr>
          <tr className="border-b transition-colors">
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 w-1/2">
              <Skeleton className="w-[112px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[96px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[48px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <a className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2 w-fit">
                <SVGSkeleton className="w-[24px] h-[24px]" />
              </a>
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"></td>
          </tr>
          <tr className="border-b transition-colors">
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 w-1/2">
              <Skeleton className="w-[128px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[96px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <Skeleton className="w-[48px] max-w-full" />
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
              <a className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2 w-fit">
                <SVGSkeleton className="w-[24px] h-[24px]" />
              </a>
            </td>
            <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
);

const LoadingState = () => (
  <div className="w-full h-full">
    <LoadingSkeleton />
  </div>
);
