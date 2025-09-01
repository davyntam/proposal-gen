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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Freelancer Proposal Generator
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Service (e.g. Web design)"
            className="w-full border rounded p-2 text-black"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
          <textarea
            placeholder="Paste job description here"
            className="w-full border rounded p-2 h-24 text-black"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your name"
            className="w-full border rounded p-2 text-black"
            value={freelancerName}
            onChange={(e) => setFreelancerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Your experience (e.g. 3 years in Shopify)"
            className="w-full border rounded p-2 text-black"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-black text-white rounded p-2"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Proposal"}
          </button>
        </form>

        {proposal && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-black">
              Generated Proposal:
            </h2>
            <pre className="whitespace-pre-wrap bg-gray-100 p-3 rounded text-black">
              {proposal}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
