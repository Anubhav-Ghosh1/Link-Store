"use client";
import React, { useEffect, useState } from "react";
import {
  IconArrowLeft,
  IconSettings,
  IconUserBolt,
  IconBrandTabler,
} from "@tabler/icons-react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

import { motion } from "framer-motion";
import { cn } from "@/utils/lib";
import Dashboard from "@/app/dashboard/page";
import { usePathname, useRouter } from "next/navigation";

type SidebarLinkType = {
  title: string;
  url: string;
};

type SidebarProps = {
  links: SidebarLinkType[];
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
};

type SidebarType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function Sidebar({
  links,
  open,
  setOpen,
  children,
}: SidebarProps) {
  const icons = [
    <IconBrandTabler />,
    <IconUserBolt />,
    <IconSettings />,
    <IconArrowLeft />,
  ];

  let isLoggedIn = false;
  const router = useRouter();
  const [path, setPath] = useState("");
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const value = () => {
    if (pathname) {
      let path_names = pathname.split("/").slice(1).join(" / ");
      setPath("Home/" + path_names);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      isLoggedIn = true;
      setIsSidebarOpen(true);
    }
    console.log("Token", token);
  }, [pathname]);

  useEffect(() => {
    value();
  }, [pathname]);

  return (
    <div
      className={cn(
        "flex flex-col w-full overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-screen"
      )}
    >
      {isSideBarOpen && (
        <aside
          className={cn(
            "transition-all duration-300 ease-in-out border-r border-neutral-300 dark:border-neutral-700",
            open ? "w-full md:w-64" : "w-full md:w-20"
          )}
        >
          <div className="flex h-full flex-col justify-between">
            <div className="p-4">
              {open ? (
                <Logo open={open} setOpen={setOpen} />
              ) : (
                <LogoIcon open={open} setOpen={setOpen} />
              )}
              <div className="mt-8 flex flex-row md:flex-col overflow-x-auto gap-2">
                {links.map((link, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (link.title === "Logout") {
                        handleLogout();
                        router.push("/login");
                      } else {
                        router.push(link.url);
                      }
                    }}
                    className="flex items-center gap-3 rounded px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    <span className="h-5 w-5 shrink-0">
                      {icons[idx % icons.length]}
                    </span>
                    {open && <span>{link.title}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}
      <div className="w-full overflow-y-auto bg-white">
        <div>
          {/* <p className="text-gray-950">{path}</p> */}
        </div>
        {children}
      </div>
    </div>
  );
}

const Logo = ({ open, setOpen }: SidebarType) => (
  <div className="flex items-center md:px-3 gap-4">
    <button onClick={() => setOpen(!open)}>
      <FaArrowLeft className="text-gray-200 hidden md:flex" />
    </button>
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p className="text-gray-200 text-lg text-center font-semibold">
        Link Store
      </p>
    </motion.span>
  </div>
);

const LogoIcon = ({ open, setOpen }: SidebarType) => (
  <div className="flex items-center justify-center gap-2">
    <button onClick={() => setOpen(!open)}>
      <FaArrowRight className="text-gray-200" />
    </button>
  </div>
);
