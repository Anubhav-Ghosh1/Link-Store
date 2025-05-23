"use client";
import React, { useState } from "react";
import Sidebar from "./components/ui/sidebar";

export default function LayoutOne({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      
      {children}
    </div>
  );
}
