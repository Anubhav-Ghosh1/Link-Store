"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { MdOutlineMailOutline } from "react-icons/md";

export default function ConfirmationPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center w-full h-screen animate-gradient bg-gradient-to-r from-blue-200 via-blue-50 to-blue-200">
      <div className="flex flex-col gap-y-4 items-center justify-center bg-white w-full rounded-lg border border-gray-200 shadow-md max-w-[600px] h-full max-h-[350px]">
        <div className="flex flex-col items-center gap-y-2">
          <p className="text-xl font-semibold">Confirm your account</p>
          <p className="text-sm text-gray-500">
            Please check your email for the confirmation link.
          </p>
        </div>
        <button
          onClick={() => {
            router.push("/login");
          }}
          className="bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-500 transition-all duration-200 ease-in"
        >
          Login
        </button>
      </div>
    </div>
  );
}
