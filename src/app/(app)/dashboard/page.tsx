//import CreateClassroomDialog from "@/components/CreateClassroomDialog";
import UserData from "@/components/UserData";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/auth/utils";
import { getServerSession } from "next-auth";
import React from "react";

const StudentDashboard = async () => {
  const session = await getServerSession(authOptions);
  //{session?.user.access !== "USER" && <CreateClassroomDialog />}

  return (
    <div className="min-h-screen h-full dark:bg-[rgb(10,10,10)]">
      <div className=" flex items-center justify-between pt-24">
        <h1 className="md:text-3xl text-xl font-semibold">
          Welcome {session?.user?.name},
        </h1>
      </div>
      <Separator className="mt-3" />
      <div>
        <UserData />
      </div>
    </div>
  );
};

export default StudentDashboard;
