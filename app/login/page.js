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
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        {
          email,
          password,
        }
      );
      setLoading(false);
      toast.success("Login successful");
      console.log(data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("role", data.role);
      localStorage.setItem("name", data.name);
      router.push("/dashboard");
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message || "Invalid credentials";
      console.error("Login Error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-white mx-4 p-6 rounded-lg shadow-md w-96">
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
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-green-500"
          } text-white p-2 rounded`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
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
