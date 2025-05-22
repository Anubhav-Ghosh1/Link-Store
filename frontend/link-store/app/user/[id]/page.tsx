"use client";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoCellular, IoLogoGithub } from "react-icons/io5";

export default function User() {
  const { id } = useParams();
  const { user } = useUser();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  //   const fetchUser = async () => {
  //     try {
  //       const res = await fetch(`${API_URL}/user/${id}`, {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       });

  //       const data = await res.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     }
  //   };

  const [userDetails, setUserDetails] = useState<any>(null);
  useEffect(() => {
    const userDetails = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null;
    setUserDetails(userDetails);
  }, []);
  console.log("User", user, "User Details", userDetails);
  const [userData, setUserData] = useState<any>(null);
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/link/user-links/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("User Data 1", data);
      setUserData(data.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  React.useEffect(() => {
    fetchUser();
  }, []);
  console.log("User ID", id);
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100">
      <div className="w-[350px] bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 flex justify-between items-center px-4 py-2 border-b border-gray-200">
          <IoCellular className="text-gray-500" />
          <IoLogoGithub className="text-gray-500" />
        </div>
        <div className="p-6">
          {userData && (
            <>
            <div className="text-center mb-6">
                <Image
                    src={`https://api.dicebear.com/7.x/initials/png?seed=${userData?.displayName || "User"}`}
                    alt={userData?.displayName || "User"}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-4"
                />
                <p className="text-xl font-bold text-gray-800">
                    {userData?.username || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500">{userData?.bio || "No bio available"}</p>
            </div>
              <div className="flex flex-col items-center gap-4">
                {userData.socialLinks.map((link: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => window.open(link.url, "_blank")}
                    className="flex items-center w-full max-w-[300px] cursor-pointer hover:scale-[0.98] hover:shadow-md active:scale-[0.97] active:shadow-md transition-transform duration-200 p-3 border rounded-full shadow-sm bg-gray-50"
                  >
                    <Image
                      src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=32`}
                      alt={link.title}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div className="w-full text-center">
                      <p className="text-sm font-medium text-gray-700">
                        {link.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
