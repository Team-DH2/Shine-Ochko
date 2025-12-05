"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { FaArrowRight } from "react-icons/fa";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SearchFunction({ styleDesktop }: any) {
  const [searchValue, setSearchValue] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [firstOpen, setFirstOpen] = useState(false);
  const router = useRouter();

  // Debounce
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
    if (!searchValue.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ searchValue }),
      });

      const data = await res.json();
      setIsOpen(true);
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) setIsOpen(false);
        }}
      >
        <PopoverTrigger
          onClick={() => {
            setIsOpen(true);
            setFirstOpen(true);
          }}
        >
          <Input
            type="text"
            placeholder="Хайх..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styleDesktop}
          />
        </PopoverTrigger>

        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="transition-all duration-200"
        >
          {/* А. Эхний фокус үед гарч ирэх анхны текст */}
          {!searchValue && firstOpen && (
            <p className="text-gray-400 py-6 text-center">
              Та хүссэн зүйлээ хайгаарай ✨
            </p>
          )}

          {/* B. Хайж байгаа үед */}
          {loading && (
            <p className="mt-2 text-gray-400 text-center">Хайж байна...</p>
          )}

          {/* C. Илэрц гарсан үед */}
          {results && !loading && searchValue && (
            <div className="mt-2 space-y-6 max-h-80 overflow-auto text-black">
              {/* Event Halls */}
              {results?.halls?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold mb-2 text-black">
                    🏛 Event Halls
                  </h2>
                  <div className="space-y-2">
                    {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      results.halls.map((hall: any) => (
                        <div
                          key={hall.id}
                          className="p-3 bg-white rounded shadow cursor-pointer hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center gap-4">
                            <h3 className="font-semibold">{hall.name}</h3>
                            <Button
                              onClick={() =>
                                router.push(`/event-halls/${hall.id}`)
                              }
                              className="bg-white"
                            >
                              <FaArrowRight color="black" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-600">
                            {hall.location}
                          </p>
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
                        <div
                          key={p.id}
                          className="p-3 bg-white rounded shadow hover:bg-gray-100 transition"
                        >
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
                        <div
                          key={h.id}
                          className="p-3 bg-white rounded shadow hover:bg-gray-100 transition"
                        >
                          <h3 className="font-semibold">{h.name}</h3>
                          <p className="text-sm text-gray-600">
                            {h.contact_phone}
                          </p>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* No Results */}
              {results?.halls?.length === 0 &&
                results?.performers?.length === 0 &&
                results?.hosts?.length === 0 && (
                  <p className="text-gray-400 text-center">Илэрц олдсонгүй.</p>
                )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
