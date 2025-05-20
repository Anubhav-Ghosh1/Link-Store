"use client";
import { useUser } from "@/context/UserContext";
import { useParams } from "next/navigation";
import React from "react";

export default function User() {
  const { id } = useParams();
  const { user } = useUser();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/user/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  const userDetails = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
  console.log("User", user, "User Details", userDetails);
  console.log("User ID", id);
  return <div>User</div>;
}
