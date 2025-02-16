"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios
        .get(
          `https://uni-voting-project-backend.onrender.com/verify-email?token=${token}`
        )
        .then(() => {
          toast.success("Email verified successfully!");
          router.push("/login");
        })
        .catch(() => {
          toast.error("Invalid or expired token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      toast.error("No verification token found");
    }
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">
        {loading ? "Verifying email..." : "Email Verification"}
      </h2>
      {!loading && <p>Redirecting...</p>}
    </div>
  );
}
