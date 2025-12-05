"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const Search = () => {
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("value");

  const [searchValue2, setSearchValue2] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Debounce search
  useEffect(() => {
    if (!searchValue) {
      setResults(null);
      return;
    }

    const timeout = setTimeout(() => {
      // eslint-disable-next-line react-hooks/immutability
      handleSearch();
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ searchValue }),
      });

      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <input
        type="text"
        placeholder="Хайх..."
        value={searchValue2}
        onChange={(e) => setSearchValue2(e.target.value)}
        className="w-full p-3 border rounded-lg text-black"
      />

      {loading && <p className="mt-3 text-gray-400">Хайж байна...</p>}

      {results && (
        <div className="mt-4 space-y-6">
          {/* Event Halls */}
          {results?.halls?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-2">🏛 Event Halls</h2>
              <div className="space-y-2">
                {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  results.halls.map((hall: any) => (
                    <div key={hall.id} className="p-3 bg-white rounded shadow">
                      <h3 className="font-semibold">{hall.name}</h3>
                      <p className="text-sm text-gray-600">{hall.location}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Performers */}
          {results?.performers?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-2">🎤 Performers</h2>
              <div className="space-y-2">
                {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  results.performers.map((p: any) => (
                    <div key={p.id} className="p-3 bg-white rounded shadow">
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-gray-600">{p.genre}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Hosts */}
          {results?.hosts?.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-2">🎙 Hosts</h2>
              <div className="space-y-2">
                {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  results.hosts.map((h: any) => (
                    <div key={h.id} className="p-3 bg-white rounded shadow">
                      <h3 className="font-semibold">{h.name}</h3>
                      <p className="text-sm text-gray-600">{h.contact_phone}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* No results */}
          {results?.halls?.length === 0 &&
            results?.performers?.length === 0 &&
            results?.hosts?.length === 0 && (
              <p className="text-gray-400">Илэрц олдсонгүй.</p>
            )}
        </div>
      )}
    </div>
  );
};
export default Search;
