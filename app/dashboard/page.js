"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [email, setEmail] = useState("");
  const [votedCandidates, setVotedCandidates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);

    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          "https://uni-voting-project-backend.onrender.com/results"
        );
        const groupedByPosition = response.data.reduce((acc, candidate) => {
          if (!acc[candidate.position]) {
            acc[candidate.position] = [];
          }
          acc[candidate.position].push(candidate);
          return acc;
        }, {});
        setCandidates(groupedByPosition);
      } catch (error) {
        toast.error("Failed to load candidates");
      }
    };

    const fetchVotedCandidates = async () => {
      if (!storedEmail) return;
      try {
        const response = await axios.get(
          `https://uni-voting-project-backend.onrender.com/user-votes?email=${storedEmail}`
        );
        setVotedCandidates(response.data.votedCandidates || []);
      } catch (error) {
        console.error("Error fetching user votes:", error);
      }
    };

    fetchCandidates();
    fetchVotedCandidates();
  }, []);

  const handleVote = async (candidateId) => {
    if (votedCandidates.includes(candidateId)) {
      toast.error("You have already voted for this candidate");
      return;
    }

    try {
      await axios.post("https://uni-voting-project-backend.onrender.com/vote", {
        email,
        candidateId,
      });
      toast.success("Vote cast successfully");
      setVotedCandidates([...votedCandidates, candidateId]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to vote");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">
        Dashboard - Vote for a Candidate
      </h2>
      <input
        className="w-full p-2 border rounded mb-4"
        type="email"
        placeholder="Enter your email"
        value={`Welcome, ${email}`}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled
      />
      <div className="space-y-4">
        {Object.entries(candidates).map(([position, candidatesList]) => (
          <div key={position} className="mb-6">
            <h3 className="text-lg font-bold mb-2">{position}</h3>
            {candidatesList.map((candidate) => (
              <div
                key={candidate.id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{candidate.name}</h3>
                  <p className="text-gray-600">{candidate.party}</p>
                </div>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleVote(candidate.id)}
                  disabled={votedCandidates.includes(candidate.id)}
                >
                  {votedCandidates.includes(candidate.id) ? "Voted" : "Vote"}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
