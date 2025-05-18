'use client';

import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen pt-4 bg-gradient-to-t from-white via-blue-100 to-blue-100 px-4">
      <div className="min-w-full flex justify-center">
        <Navbar/>
      </div>
    </div>
  );
}
