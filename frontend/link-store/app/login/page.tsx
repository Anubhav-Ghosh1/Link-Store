"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Login() {
  const router = useRouter();

  const { user, setUser } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      setUser({
        id: data.data.user._id,
        displayName: data.data.user.displayName,
        email: data.data.user.email,
        confirmed: data.data.user.confirmed,
        profileViews: data.data.user.profileViews,
        socialLinks: data.data.user.socialLinks,
        username: data.data.user.username,
        theme: {
          background: data.data.user.theme.background,
          color: data.data.user.theme.color,
          font: data.data.user.theme.font,
        },
      });

      console.log("User", user);

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token (optionally in localStorage or cookies)
      localStorage.setItem("token", data.data.accessToken);

      // Redirect to dashboard or wherever
      // router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    router.push("/signup");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4 animate-gradient bg-gradient-to-r from-blue-200 via-blue-50 to-blue-200">
      <div className="w-full flex flex-col items-center max-w-md p-8 rounded-xl shadow-lg border-2 border-gray-200 bg-white/90 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">
          Login to Link Store
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg placeholder:text-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg placeholder:text-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-lg font-semibold hover:bg-gray-950 transition-all ease-in duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div
          onClick={handleSignupClick}
          className="flex flex-wrap cursor-pointer w-fit mt-4 justify-center gap-x-1 items-center font-medium text-gray-950"
        >
          New to Link Store?{" "}
          <span className="text-blue-500 font-semibold">Signup Here</span>
        </div>
      </div>
    </main>
  );
}
