"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LucideIcon } from "lucide-react";
import { defaultLinks, additionalLinks } from "@/config/nav";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

const SidebarItems = () => {
  return (
    <TooltipProvider>
      <>
        <SidebarLinkGroup links={defaultLinks} />
        {additionalLinks.length > 0
          ? additionalLinks.map((l) => (
            <SidebarLinkGroup
              links={l.links}
              title={l.title}
              border
              key={l.title}
            />
          ))
          : null}
      </>
    </TooltipProvider>
  );
};

export default SidebarItems;

const SidebarLinkGroup = ({
  links,
  title,
  border,
}: {
  links: SidebarLink[];
  title?: string;
  border?: boolean;
}) => {
  const fullPathname = usePathname();
  const pathname = "/" + fullPathname.split("/")[1];

  return (
    <div className={border ? "border-border border-t my-8 pt-4" : ""}>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.title}>
            <SidebarLink link={link} active={pathname === link.href} />
          </li>
        ))}
      </ul>
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
    </div>
  );
};

const SidebarLink = ({
  link,
  active,
}: {
  link: SidebarLink;
  active: boolean;
}) => {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Link
          href={link.href}
          className={`group transition-colors p-2 inline-block hover:bg-popover hover:text-primary text-muted-foreground text-xs hover:shadow rounded-md w-full${active ? " text-primary font-semibold" : ""
            }`}
        >
          <div className="flex items-center justify-center">
            <link.icon className="h-6 w-6" />
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{link.title}</p>
      </TooltipContent>
    </Tooltip>
  );
};
