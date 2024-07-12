"use client";
import React, { useEffect, useState } from "react";
import { Skeleton, SVGSkeleton } from "@/components/ui/skeleton";
import { fetchAllOrganizations, getUserData } from "@/app/(app)/_actions/userActions";
import Image from "next/image";
import JoinOrganizationForm from "./JoinOrganizationForm";
import { ExtendedOrganization, ExtendedUserData } from "@/lib/ExtendedTypes";

const fetchUserData = async (): Promise<any> => {
  const response = await getUserData();
  return response;
};

const UserData = () => {
  const [userData, setUserData] = useState<ExtendedUserData>(null);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [organizations, setOrganizations] = useState<ExtendedOrganization[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      setIsUserLoading(true);
      try {
        const userDataFromAction = await fetchUserData();
        setUserData(userDataFromAction);
        const organizationsFromAction = await fetchAllOrganizations();
        setOrganizations(organizationsFromAction);
      } catch (error) {
        console.error('Error fetching user userDataFromAction:', error);
      } finally {
        setIsUserLoading(false);
      }
    };

    loadUserData();
  }, []);

  console.log(userData);

  if (isUserLoading) return <LoadingState />;
  if (!userData) return <LoadingState />;

  if (!organizations || organizations.length === 0) {
    return (
      <div className="flex flex-col gap-8 w-full items-center mt-24">
        <Image
          alt="an image of a picture and directory icon"
          width="300"
          height="300"
          src="/empty.svg"
        />
        <p className="text-2xl text-center">You don&apos;t have any classroom. Please join a classroom</p>
      </div>
    );
  }

  if (!userData?.organizations || userData.organizations.length === 0) {
    return <JoinOrganizationForm organizations={organizations} userData={userData!} />;
  }

  return <pre>{JSON.stringify(userData, null, 2)}</pre>;
}

export default UserData;

const LoadingSkeleton = () => {
  const rows = Array.from({ length: 3 });

  return (
    <>
      <div className="pb-14">
        <h1 className="pt-8 pb-4">
          <Skeleton className="w-[104px] max-w-full" />
        </h1>
        <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 flex-1 my-4">
          <Skeleton className="w-[200px] max-w-full" />
        </div>
        <div>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom">
              <caption className="mt-4 pb-4">
                <Skeleton className="w-[320px] max-w-full" />
              </caption>
              <thead className="[&amp;_tr]:border-b">
                <tr className="border-b transition-colors">
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-left w-1/3">
                    <Skeleton className="w-[112px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                    <Skeleton className="w-[80px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                    <Skeleton className="w-[56px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                    <Skeleton className="w-[64px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                    <Skeleton className="w-[32px] max-w-full" />
                  </th>
                  <th className="h-12 px-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                    <Skeleton className="w-[48px] max-w-full" />
                  </th>
                </tr>
              </thead>
              <tbody className="[&amp;_tr:last-child]:border-0">
                {/* Map over the array to generate multiple rows */}
                {rows.map((_, index) => (
                  <tr key={index} className="border-b transition-colors">
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-left">
                      <Skeleton className="w-[56px] max-w-full" />
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <Skeleton className="w-[48px] max-w-full" />
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <Skeleton className="w-[16px] max-w-full" />
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <Skeleton className="w-[14px] max-w-full" />
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <a className="w-[16.666%]">
                        <Skeleton className="w-[32px] max-w-full" />
                      </a>
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <div className="inline-flex items-center justify-center transition-colors h-10 px-4 py-2">
                        <SVGSkeleton className="w-[24px] h-[24px]" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

const LoadingState = () => (
  <div className="w-full h-full">
    <LoadingSkeleton />
  </div>
);
