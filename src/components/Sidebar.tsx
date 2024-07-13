"use client";

import Link from "next/link";
import SidebarItems from "./SidebarItems";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Waves, LogOut } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  return (
    <aside className="h-screen w-20 bg-[rgb(10,10,10)] hidden md:block p-4 pt-8 border-r border-border shadow-inner">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-6">
          <Link href="/">
            <Waves className="w-6 h-6 ml-3" />
          </Link>
          <SidebarItems />
        </div>
        <div className="flex flex-col gap-6">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                className="w-full h-10 flex items-center justify-center mt-3"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="w-6 h-6 text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sign out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <UserDetails session={session} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

const UserDetails = ({ session }: { session: any }) => {
  const { user } = session;

  if (!user?.name || user.name.length === 0) return null;

  return (
    <TooltipProvider>
      <Link href="/account">
        <div className="flex items-center justify-between w-full border-t border-border pt-4 px-2">
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.image ?? "/default-avatar.png"} />
                <AvatarFallback className="border-border border-2 text-muted-foreground">
                  {user.name
                    ? user.name
                      ?.split(" ")
                      .map((word: any) => word[0].toUpperCase())
                      .join("")
                    : "~"}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-xs mb-1">{user.name}</p>
              <p>{user.email}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Link>
    </TooltipProvider>
  );
};

