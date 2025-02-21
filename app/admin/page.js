"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Admin() {
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [position, setPosition] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [results, setResults] = useState({});
  const router = useRouter();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     window.location.reload();
  //   }, 5000);

  //   return () => clearInterval(interval); // Cleanup on unmount
  // }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedRole = localStorage.getItem("role")?.trim().toLowerCase();

    if (!storedEmail || storedRole !== "admin") {
      toast.error("Access denied");
      router.replace("/dashboard");
      return;
    }

    setEmail(storedEmail);
    setRole(storedRole);

    const fetchResults = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/results`
        );

        // Group results by position
        const groupedResults = response.data.reduce((acc, candidate) => {
          acc[candidate.position] = acc[candidate.position] || [];
          acc[candidate.position].push(candidate);
          return acc;
        }, {});

        setResults(groupedResults);
      } catch (error) {
        toast.error("Failed to load results");
      }
    };

    fetchResults();
    const interval = setInterval(fetchResults, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/add-candidate`, {
        name,
        party,
        position,
      });
      toast.success("Candidate added successfully");
      setName("");
      setParty("");
      setPosition("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add candidate");
    }
  };

  const deleteCandidate = async (candidateId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/delete-candidate/${candidateId}`
      );
      toast.success("Candidate deleted successfully");
      setCandidates((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((position) => {
          updated[position] = updated[position].filter(
            (c) => c.id !== candidateId
          );
        });
        return updated;
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete candidate"
      );
    }
  };
  return (
    <div className="bg-white p-6 mx-4 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Admin - Add Candidate</h2>
      <form onSubmit={handleAddCandidate} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Candidate Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Party"
          value={party}
          onChange={(e) => setParty(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Position (e.g. President, Secretary)"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />
        <button
          className="w-full bg-green-500 text-white p-2 rounded"
          type="submit"
        >
          Add Candidate
        </button>
      </form>

      <h1 className="text-xl font-bold mt-6">Election Results</h1>
      {Object.keys(results).map((position) => (
        <div key={position} className="mt-4">
          <h2 className="text-lg font-semibold">{position}</h2>
          {results[position].map((candidate) => (
            <ul className="space-y-2">
              <li
                key={candidate.id}
                className="p-2 border rounded flex justify-between"
              >
                <span>
                  {candidate.name} ({candidate.party})
                </span>
                <span className="font-bold">{candidate.votes} votes</span>
              </li>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteCandidate(candidate.id)}
              >
                Remove Candidate
              </button>
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
}
