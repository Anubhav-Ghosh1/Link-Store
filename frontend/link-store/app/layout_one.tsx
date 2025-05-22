"use client";
import React, { useState } from "react";
import Sidebar from "./components/ui/sidebar";

export default function LayoutOne({ children }: { children: React.ReactNode }) {
  const pages = [
    { title: "Dashboard", url: "/dashboard" },
    { title: "Profile", url: "/user" },
    { title: "Settings", url: "#" },
    { title: "Logout", url: "#" },
  ];
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar links={pages} open={open} setOpen={setOpen}>
        {children}
      </Sidebar>
    </div>
  );
}
