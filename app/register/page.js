// app/register/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      router.replace("/dashboard"); // Redirect logged-in users to the dashboard
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://uni-voting-project-backend.onrender.com/register",
        { email, password }
      );
      toast.success(
        "Registration successful. Check your email for verification."
      );
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed. Try again."
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded"
          type="submit"
        >
          Register
        </button>
      </form>

      <p className="mt-4 font-medium">
        already have an account?{" "}
        <Link href={"/login"} className="text-justify text-red-700">
          Login
        </Link>
      </p>
    </div>
  );
}
