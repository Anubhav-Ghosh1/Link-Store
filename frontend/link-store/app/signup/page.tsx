"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Login() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        username: "",
        displayName: "",
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
            const res = await fetch(`${API_URL}/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            // Store token (optionally in localStorage or cookies)
            localStorage.setItem("token", data.token);
            
            // Redirect to dashboard or wherever
            // router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginClick = () => {
        router.push("/login");
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-white px-4 animate-gradient bg-gradient-to-r from-blue-200 via-blue-50 to-blue-200">
            <div className="w-full flex flex-col items-center max-w-md p-8 rounded-xl shadow-lg border-2 border-gray-200 bg-white/90 backdrop-blur-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-black">
                    Signup to Link Store
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
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 border rounded-lg placeholder:text-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Public Name
                        </label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="Enter your public name"
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
                    onClick={handleLoginClick}
                    className="flex flex-wrap cursor-pointer w-fit mt-4 justify-center gap-x-1 items-center font-medium text-gray-950"
                >
                    Already have a account {" "}
                    <span className="text-blue-500 font-semibold">
                        Login here
                    </span>
                </div>
            </div>
        </main>
    );
}