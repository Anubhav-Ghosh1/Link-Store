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
import { usePathname, useRouter } from "next/navigation";

type NavbarLinkType = {
  title: string;
  url: string;
};

type NavbarProps = {
  links: NavbarLinkType[];
  open: boolean;
  setOpen: (open: boolean) => void;
};

type NavbarType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function Navbar({ links, open, setOpen }: NavbarProps) {
  const icons = [
    <IconBrandTabler />,
    <IconUserBolt />,
    <IconSettings />,
    <IconArrowLeft />,
  ];

  let isLoggedIn = false;
  const router = useRouter();
  const [path, setPath] = useState("");
  const pathname = usePathname();
  const value = () => {
    if (pathname) {
      let path_names = pathname.split("/").slice(1).join(" / ");
      setPath("Home/" + path_names);
    }
  };

  const handleLogout = () => {
    setOpen(false);
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      isLoggedIn = true;
      setOpen(true);
    }
    console.log("Token", token);
  }, [pathname]);

  useEffect(() => {
    value();
  }, [pathname]);

  return (
    <div
      className={cn(
        `flex flex-col ${pathname.includes("user") ? "hidden" : ""} w-full overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800`
      )}
    >
      <nav
        className={cn(
          "flex items-center justify-between px-4 py-2 border-b border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800",
          "w-full"
        )}
      >
        <div className="flex items-center gap-4">
          {open ? (
            <Logo open={open} setOpen={setOpen} />
          ) : (
            <LogoIcon open={open} setOpen={setOpen} />
          )}
        </div>
        <div className="flex items-center gap-4">
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
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-200 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              <span className="h-5 w-5 shrink-0">
                {icons[idx % icons.length]}
              </span>
              {open && <span>{link.title}</span>}
            </div>
          ))}
        </div>
      </nav>
      <div className="w-full overflow-y-auto bg-white">
        <div>{/* <p className="text-gray-950">{path}</p> */}</div>
      </div>
    </div>
  );
}

const Logo = ({ open, setOpen }: NavbarType) => (
  <div className="flex items-center gap-4">
    <button onClick={() => setOpen(!open)}>
      <FaArrowLeft className="text-gray-200" />
    </button>
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p className="text-gray-200 text-lg font-semibold">Link Store</p>
    </motion.span>
  </div>
);

const LogoIcon = ({ open, setOpen }: NavbarType) => (
  <div className="flex items-center justify-center gap-2">
    <button onClick={() => setOpen(!open)}>
      <FaArrowRight className="text-gray-200" />
    </button>
  </div>
);
