"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import FaceAuth from "@/components/FaceAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [matricNumber, setMatricNumber] = useState("");
  const [password, setPassword] = useState("");
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !matricNumber || !password) {
      toast.error("All fields are required.");
      return;
    }

    if (!faceDescriptor) {
      toast.error("Please capture your face before registering.");
      return;
    }

    try {
      setLoading(true);
      console.log(name, faceDescriptor, matricNumber, email, password);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/register-face`,
        {
          name,
          email,
          matricNumber,
          password,
          faceDescriptor,
        }
      );

      setLoading(false);
      toast.success(response.data.message || "Registration successful.");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message || "Registration failed. Try again.";
      console.error("Registration Error:", errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-white mx-4 p-6 rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          type="text"
          placeholder="Matric Number"
          value={matricNumber}
          onChange={(e) => setMatricNumber(e.target.value)}
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

        {/* Face Authentication Component */}
        <FaceAuth onCapture={(descriptor) => setFaceDescriptor(descriptor)} />

        {faceCaptured && (
          <p className="text-green-600">Face Captured Successfully</p>
        )}

        <button
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-500"
          } text-white p-2 rounded`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 font-medium">
        Already have an account?{" "}
        <Link href={"/login"} className="text-justify text-red-700">
          Login
        </Link>
      </p>
    </div>
  );
}
