"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "./ui/separator";
import CreateProjectDialog from "./CreateProjectDialog";
import Link from "next/link";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import DeleteOrganizationDialog from "./DeleteOrganizationDialog";
import LeaveOrganizationDialog from "./LeaveOrganizationDialog"; "./LeaveOrganizationDialog.tsx"
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
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
  user: {
    id: string;
    name: string;
    access: Role;
  }
}
type ExtendedProject = {
  id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationPageDisplay = ({ organizationId, user }: Props) => {
  const router = useRouter();
  const [organizationData, setOrganizationData] = useState<ExtendedOrganization>();
  const [isLoading, setIsLoading] = useState(false);
  const [filteredSubjects, setFilteredSubjects] = useState<ExtendedProject[] | []>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrganizationData = async () => {
      setIsLoading(true);
      try {
        const data = await actionFetchOrganizationData(organizationId);
        setOrganizationData(data!);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch organization data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationData();
  }, [organizationId]);

  useEffect(() => {
    if (organizationData?.projects) {
      const filtered = organizationData.projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubjects(filtered);
    }
  }, [organizationData, searchQuery]);


  useEffect(() => {
    if (organizationData?.projects) {
      const filtered = organizationData.projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubjects(filtered);
    }
  }, [organizationData, searchQuery]);

  if (isLoading || !organizationData) return <LoadingState />;

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
              <BreadcrumbPage>{organizationData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-2">
          {user.access !== "USER" && (
            <CreateProjectDialog organizationId={organizationId} />
          )}
          {user.id === organizationData.admin.id ? (
            <DeleteOrganizationDialog organizationId={organizationId} />
          ) : (
            <LeaveOrganizationDialog organizationId={organizationId} />
          )}
        </div>
      </div>
      <Separator className="mt-3 mb-6" />
      <Input
        className="flex-1 dark:bg-[rgb(17,17,17)] bg-neutral-200"
        placeholder="Start typing to search..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {organizationData.projects.length === 0 && (
        <div className="mt-6">
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Image
              alt="an image of a picture and directory icon"
              width="300"
              height="300"
              src="/empty.svg"
            />
            <div className="text-2xl text-center">
              No subjects found. Come back later or create a new subject.
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-6 pb-14">
        {organizationData.projects.length > 0 &&
          filteredSubjects.map((project) => (
            <Link
              href={`/organization/${organizationId}/${project.id}`}
              className="cursor-pointer border-white border rounded-xl"
              key={project.id}
            >
              <Card className="flex flex-col items-start justify-start p-8 rounded-xl dark:bg-[rgb(17,17,17)]/100">
                <h1 className="text-xl font-bold">{project.name}</h1>
                <h1 className="text-base">
                  Number of SOP&apos;s: TODO : Add number of SOP&apos;s
                </h1>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default OrganizationPageDisplay;
import { Skeleton, SVGSkeleton } from "@/components/ui/skeleton";
import { ExtendedOrganization } from "@/lib/ExtendedTypes";
import { Role, User, UserProject } from "@prisma/client";
import { actionFetchOrganizationData } from "@/app/(app)/_actions/userActions";

const LoadingSkeleton = () => (
  <>
    <div>
      <div className="flex items-center justify-between">
        <nav>
          <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
            <li className="inline-flex items-center gap-1.5">
              <a className="transition-colors">
                <Skeleton className="w-[72px] max-w-full" />
              </a>
            </li>
            <li className="[&amp;>svg]:size-3.5">
              <SVGSkeleton className="lucide-chevron-right w-[24px] h-[24px]" />
            </li>
            <li className="inline-flex items-center gap-1.5">
              <span>
                <Skeleton className="w-[56px] max-w-full" />
              </span>
            </li>
          </ol>
        </nav>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2"></div>
          <div>
            <SVGSkeleton className="w-[24px] h-[24px]" />
          </div>
        </div>
      </div>
      <div className="shrink-0 bg-border h-[1px] w-full mt-3 mb-6"></div>
      <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 flex-1">
        <Skeleton className="w-[200px] max-w-full" />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-6 pb-14">
        <a className="border-white border">
          <div className="border shadow-sm flex flex-col items-start justify-start p-8">
            <h1>
              <Skeleton className="w-[32px] max-w-full" />
            </h1>
            <h1>
              <Skeleton className="w-[176px] max-w-full" />
            </h1>
          </div>
        </a>
        <a className="border-white border">
          <div className="border shadow-sm flex flex-col items-start justify-start p-8">
            <h1>
              <Skeleton className="w-[24px] max-w-full" />
            </h1>
            <h1>
              <Skeleton className="w-[176px] max-w-full" />
            </h1>
          </div>
        </a>
        <a className="border-white border">
          <div className="border shadow-sm flex flex-col items-start justify-start p-8">
            <h1>
              <Skeleton className="w-[40px] max-w-full" />
            </h1>
            <h1>
              <Skeleton className="w-[176px] max-w-full" />
            </h1>
          </div>
        </a>
        <a className="border-white border">
          <div className="border shadow-sm flex flex-col items-start justify-start p-8">
            <h1>
              <Skeleton className="w-[24px] max-w-full" />
            </h1>
            <h1>
              <Skeleton className="w-[176px] max-w-full" />
            </h1>
          </div>
        </a>
      </div>
    </div>
  </>
);

const LoadingState = () => (
  <div className="w-full h-full">
    <LoadingSkeleton />
  </div>
);
