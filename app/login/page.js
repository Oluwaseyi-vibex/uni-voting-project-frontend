// app/login/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      router.replace("/dashboard"); // Redirect logged-in users to the dashboard
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://uni-voting-project-backend.onrender.com/login",
        {
          email,
          password,
        }
      );
      toast.success("Login successful");
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email); // Store the email
      localStorage.setItem("role", data.role); // Store the role
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
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
          className="w-full bg-green-500 text-white p-2 rounded"
          type="submit"
        >
          Login
        </button>
      </form>
      <p className="mt-4 font-medium">
        Dont have an account?{" "}
        <Link href={"/register"} className="text-justify text-red-700">
          Sign up
        </Link>
      </p>
    </div>
  );
}
