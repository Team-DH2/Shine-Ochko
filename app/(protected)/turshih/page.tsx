"use client";

import { useState } from "react";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, content }),
      });

      const data = await res.json();
      setResponse(data.message);
    } catch (err) {
      setResponse("Алдаа гарлаа");
    }

    setLoading(false);
  }

  return (
    <div className="p-10 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-5 text-white">Email Test Form</h1>

      <form onSubmit={sendEmail} className="space-y-4">
        <input
          type="email"
          placeholder="Email хүлээн авагч"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Нэр"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Илгээх message"
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 h-28"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
        >
          {loading ? "Илгээж байна..." : "Илгээх"}
        </button>
      </form>

      {response && (
        <p className="mt-4 p-2 bg-gray-700 rounded text-green-300">
          {response}
        </p>
      )}
    </div>
  );
}
