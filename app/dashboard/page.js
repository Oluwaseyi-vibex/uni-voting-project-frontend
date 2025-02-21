"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [votedCandidates, setVotedCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setEmail(storedEmail);

    const StoredName = localStorage.getItem("name");
    if (StoredName) setName(StoredName);

    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/results`
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
          `${process.env.NEXT_PUBLIC_BASE_URL}/user-votes?email=${storedEmail}`
        );
        setVotedCandidates(response.data.votedCandidates || []);
      } catch (error) {
        console.error("Error fetching user votes:", error);
      }
    };

    fetchCandidates();
    fetchVotedCandidates();
    const interval = setInterval(fetchCandidates, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleVote = async (candidateId) => {
    if (votedCandidates.includes(candidateId)) {
      toast.error("You have already voted for this candidate");
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/vote`, {
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
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    router.push("/login");
  };

  return (
    <div className="bg-white p-6 mx-4 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">
        Dashboard - Vote for a Candidate
      </h2>
      <h1 className="text-lg font-medium">Welcome back, {name}</h1>
      {Object.entries(candidates).length === 0 ? (
        <div>Nothing to show at the moment</div>
      ) : (
        <div className="space-y-4 mt-6">
          <div className="text-xl font-bold">Candidates to vote for:</div>
          {Object.entries(candidates).map(([position, candidatesList]) => (
            <div key={position} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{position}</h3>
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
      )}
      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
