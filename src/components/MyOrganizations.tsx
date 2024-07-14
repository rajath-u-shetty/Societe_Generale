import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import Image from "next/image";
import { ExtendedOrganization, ExtendedUserData } from "@/lib/ExtendedTypes";
import { LoadingState } from "./UserData";
import JoinOrganizationDialog from "./JoinOrganizationDialog";
import LeaveOrganizationDialog from "./LeaveOrganizationDialog";
import DeleteOrganizationDialog from "./DeleteOrganizationDialog";

type Props = {
  organizations: ExtendedOrganization[]
  userData: ExtendedUserData
  allOrganizations: ExtendedOrganization[]
}

function MyClassroom({ organizations, userData, allOrganizations }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter organizations based on search query
  const filteredOrganizations = organizations.filter((organization) =>
    organization.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter allOrganizations based on search query and exclude already joined organizations
  const filteredAllOrganizations = allOrganizations.filter(
    (ac) =>
      !organizations.some((c) => c.id === ac.id) &&
      ac.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!organizations || !allOrganizations || !userData) {
    return <LoadingState />;
  }

  return (
    <div className="pb-14">
      <h1 className="text-xl dark:text-gray-200 text-neutral-700 font-semibold pt-8 pb-4">
        My Organizations
      </h1>
      <Input
        className="flex-1 dark:bg-[rgb(23,23,23)] bg-neutral-200 my-4"
        placeholder="Start typing to search..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredOrganizations.length > 0 && (
        <div>
          <Table>
            <TableCaption className="pb-4">
              A list of the organizations you have joined
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left w-1/3">
                  Organization Name
                </TableHead>
                <TableHead className="text-center">Created By</TableHead>
                <TableHead className="text-center">Members</TableHead>
                <TableHead className="text-center">Projects</TableHead>
                <TableHead className="text-center">View</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.map((organization) => (
                <TableRow key={organization.id}>
                  <TableCell className="text-left font-medium">
                    {organization.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {organization.admin?.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {organization.users.length}
                  </TableCell>
                  <TableCell className="text-center">
                    {organization.projects.length}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      className={cn(
                        "w-[16.666%] text-center hover:underline underline-offset-4"
                      )}
                      href={`/organization/${organization.id}`}
                    >
                      View
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    {
                      //userData.id === organization.adminId ? (
                      //  userData.role !== "USER" && (
                      //    <DeleteClassroomDialog
                      //      classroomId={organization.id}
                      //    />
                      //  )
                      //) : (
                      //  <LeaveClassroomDialog
                      //    classroomId={organization.id}
                      //  />
                      userData.role !== "USER" ? (
                        <DeleteOrganizationDialog
                          organizationId={organization.id}
                        />
                      ) : (
                        <LeaveOrganizationDialog
                          organizationId={organization.id}
                        />
                      )
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {filteredOrganizations.length === 0 &&
        filteredAllOrganizations.length === 0 && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Image
              alt="an image of a picture and directory icon"
              width="300"
              height="300"
              src="/empty.svg"
            />
            <p className="text-2xl text-center">
              You don&apos;t have any organization. Please join a organization
            </p>
          </div>
        )}
      {filteredOrganizations.length > 0 && filteredAllOrganizations.length > 0 && (
        <Separator className="md:my-14 my-6" />
      )}
      {filteredAllOrganizations.length > 0 && (
        <div className="md:pb-14 pb-6">
          <h1 className="text-xl dark:text-gray-200 text-neutral-700 font-semibold pb-4">
            All Organizations
          </h1>
          <Table>
            <TableCaption className="pb-4">
              A list of the organizations you can join
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left w-1/3">
                  Organization Name
                </TableHead>
                <TableHead className="text-center">Created By</TableHead>
                <TableHead className="text-center">Members</TableHead>
                <TableHead className="text-center">Projects</TableHead>
                <TableHead className="text-center">Join</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAllOrganizations.map((organization) => (
                <TableRow key={organization.id}>
                  <TableCell className="text-left font-medium">
                    {organization.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {organization.admin.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {organization.users.length}
                  </TableCell>
                  <TableCell className="text-center">
                    {organization.projects.length}
                  </TableCell>
                  <TableCell className="text-center">
                    <JoinOrganizationDialog
                      organization={organization}
                      userId={userData.id}
                      userAccess={userData.role}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default MyClassroom;
