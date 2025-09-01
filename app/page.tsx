"use client";
import { useState } from "react";

export default function Home() {
  const [service, setService] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [freelancerName, setFreelancerName] = useState("");
  const [experience, setExperience] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setProposal("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          jobDescription,
          freelancerName,
          experience,
        }),
      });

      const data = await res.json();
      setProposal(data.proposal || "No proposal generated.");
    } catch (err) {
      setProposal("Error generating proposal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-black">Win Clients</h1>
          <p className="text-gray-600 mt-1">Freelancer Proposal Generator</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Service (e.g. Web design)"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none text-black"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
          <textarea
            placeholder="Paste job description here"
            className="w-full border border-gray-300 rounded-lg p-3 h-28 focus:ring-2 focus:ring-black focus:outline-none text-black"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none text-black"
            value={freelancerName}
            onChange={(e) => setFreelancerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your experience (e.g. 3 years in Shopify)"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none text-black"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-black text-white font-medium rounded-lg p-3 hover:bg-gray-800 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Proposal"}
          </button>
        </form>

        {/* Proposal Output */}
        {proposal && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-black">
              Generated Proposal
            </h2>
            <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg text-black whitespace-pre-wrap">
              {proposal}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
