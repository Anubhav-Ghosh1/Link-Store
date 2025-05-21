"use client";

import { useState, useEffect } from "react";
import { IoCodeSlash } from "react-icons/io5";
import { SiApplemusic } from "react-icons/si";

function ActiveButton({ status }: { status: string }) {
  const [isStatusConfirmed, setIsStatusConfirmed] = useState(false);
  useEffect(() => {
    if (status) {
      setIsStatusConfirmed(true);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="">Account Status : </p>
        <span className="relative flex size-3">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${
              isStatusConfirmed
                ? "bg-green-500 text-white"
                : "bg-gray-400 text-gray-800"
            } opacity-75`}
          ></span>
          <span
            className={`relative inline-flex size-3 rounded-full ${
              isStatusConfirmed
                ? "bg-green-500 text-white"
                : "bg-gray-400 text-gray-800"
            }`}
          ></span>
        </span>
        {isStatusConfirmed ? "Confirmed" : ""}
      </div>
      {isStatusConfirmed ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="text-lg">Currently coding</p>
            <IoCodeSlash className="text-lg" />
            <p className="text-lg">with</p>
            <SiApplemusic className="text-lg" />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default ActiveButton;
