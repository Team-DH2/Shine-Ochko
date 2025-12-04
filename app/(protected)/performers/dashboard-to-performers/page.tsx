"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Image from "next/image";
import { Header } from "@/components/us/Header";
import { Button } from "@/components/ui/button";

export default function PerformersPage() {
  const router = useRouter();
  const [performers, setPerformers] = useState<any[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [minPopularity, setMinPopularity] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100000000);
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    fetchPerformers();
    fetchGenres();
  }, []);
  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings));
  }, []);

  const fetchPerformers = async () => {
    try {
      const res = await fetch("/api/performers");
      const data = await res.json();
      console.log("Fetched performers:", data.performers?.length || 0);
      console.log("First performer:", data.performers?.[0]);
      setPerformers(data.performers || []);
    } catch (error) {
      console.error("Error fetching performers:", error);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch("/api/performers/genres");
      const data = await res.json();
      setGenres(data.genres || []);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const availabilityOptions = ["Боломжтой", "Хүлээгдэж байна", "Захиалагдсан"];

  const filteredPerformers = performers.filter((performer) => {
    const genreMatch =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => performer.genre?.includes(genre));
    const availabilityMatch =
      selectedAvailability.length === 0 ||
      selectedAvailability.includes(performer.availability);
    const popularityMatch = (performer.popularity || 0) >= minPopularity;
    const priceMatch =
      Number(performer.price) >= minPrice &&
      Number(performer.price) <= maxPrice;

    return genreMatch && availabilityMatch && popularityMatch && priceMatch;
  });

  // Sort performers
  const sortedPerformers = [...filteredPerformers].sort((a, b) => {
    if (sortBy === "popularity") {
      return (b.popularity || 0) - (a.popularity || 0);
    } else if (sortBy === "price-low") {
      return Number(a.price) - Number(b.price);
    } else if (sortBy === "price-high") {
      return Number(b.price) - Number(a.price);
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  console.log("Total performers:", performers.length);
  console.log("Filtered performers:", filteredPerformers.length);
  console.log("Sorted performers:", sortedPerformers.length);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Боломжтой":
        return "bg-green-600";
      case "Хүлээгдэж байна":
        return "bg-yellow-600";
      case "Захиалагдсан":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-5">
        <h1 className="text-4xl font-bold mb-8">Уран бүтээлчид хайх</h1>

        {/*sidebar*/}
        <div className="flex gap-8">
          <div>
            <div className="w-64 bg-gray-900 rounded-lg p-6 h-fit sticky top-8">
              <h2 className="text-xl font-bold text-blue-400 mb-4">
                Таны захиалсан Event hall
              </h2>
              <div className=" mb-10">
                {bookings.map((b: any) => (
                  <div
                    key={b.id}
                    className="rounded-xl overflow-hidden shadow-lg  bg-gray-900"
                  >
                    {/* CONTENT */}
                    <div>
                      <div className="flex justify-between">
                        <h2 className="text-xl font-semibold text-white">
                          {b.event_halls?.name ?? "Event Hall"}
                        </h2>
                        {/* <span
                          className={`
                    px-3 py-1rounded-full text-sm font-medium
                    ${
                      b.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : b.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                        >
                          {b.status}
                        </span> */}
                      </div>

                      {/* DATE & TIME */}
                      <div className=" text-white">
                        <div>
                          <span className="font-medium">Өдөр:</span>
                          {new Date(b.date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Эхлэх цаг:</span>{" "}
                          {b.starttime}
                        </div>
                      </div>

                      {/* DESCRIPTION */}
                      <p className="text-gray-700 text-sm">
                        {b.event_description}
                      </p>

                      {/* STATUS BADGE */}

                      {/* LOCATION */}
                      <p className="text-gray-500 text-sm truncate">
                        📍 {b.event_halls?.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="text-xl font-bold text-blue-400 mb-4">Шүүлтүүр</h2>

              {/* Genre Filter */}
              <div className="mb-6">
                <h3
                  className="font-semibold mb-3 flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={() => setIsGenreOpen(!isGenreOpen)}
                >
                  <span>🎵</span> Төрөл
                  {isGenreOpen ? (
                    <FaChevronUp className="ml-auto text-sm" />
                  ) : (
                    <FaChevronDown className="ml-auto text-sm" />
                  )}
                </h3>
                {isGenreOpen && (
                  <div className="space-y-2">
                    {genres.map((genre) => (
                      <label
                        key={genre}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedGenres([...selectedGenres, genre]);
                            } else {
                              setSelectedGenres(
                                selectedGenres.filter((g) => g !== genre)
                              );
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span>{genre}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-blue-400 mb-3">
                  Боломжтой эсэх
                </h3>
                <div className="space-y-2">
                  {availabilityOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAvailability.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAvailability([
                              ...selectedAvailability,
                              option,
                            ]);
                          } else {
                            setSelectedAvailability(
                              selectedAvailability.filter((a) => a !== option)
                            );
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Popularity Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-blue-400 mb-3">
                  Алдартай байдал
                </h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={minPopularity}
                  onChange={(e) => setMinPopularity(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-400 mt-2">
                  Хамгийн бага: {minPopularity.toLocaleString()}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-blue-400 mb-3">
                  Үнийн хүрээ
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Хамгийн бага:
                    </label>
                    <select
                      value={minPrice}
                      onChange={(e) => setMinPrice(parseInt(e.target.value))}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                    >
                      <option value="0">0₮</option>
                      <option value="500000">500,000₮</option>
                      <option value="1000000">1,000,000₮</option>
                      <option value="1500000">1,500,000₮</option>
                      <option value="2000000">2,000,000₮</option>
                      <option value="3000000">3,000,000₮</option>
                      <option value="5000000">5,000,000₮</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">
                      Хамгийн их:
                    </label>
                    <select
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
                    >
                      <option value="1000000">1,000,000₮</option>
                      <option value="2000000">2,000,000₮</option>
                      <option value="3000000">3,000,000₮</option>
                      <option value="5000000">5,000,000₮</option>
                      <option value="10000000">10,000,000₮</option>
                      <option value="100000000">Хязгааргүй</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedGenres([]);
                  setSelectedAvailability([]);
                  setMinPopularity(0);
                  setMinPrice(0);
                  setMaxPrice(100000000);
                  setSortBy("popularity");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
              >
                Шүүлтүүр цэвэрлэх
              </button>
            </div>
          </div>

          {/* Performers Grid */}
          <div className="flex-1">
            <div className="mb-4 text-gray-400 text-sm">
              {sortedPerformers.length} уран бүтээлч олдлоо
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPerformers.map((performer) => (
                <div
                  key={performer.id}
                  className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform"
                >
                  {/* Performer Image */}
                  <div className="relative h-90 bg-gray-800">
                    <Image
                      src={
                        performer.image ||
                        "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={performer.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div
                      className={`absolute top-3 left-3 ${getAvailabilityColor(
                        performer.availability || "Боломжтой"
                      )} text-white px-3 py-1 rounded-full text-xs font-semibold`}
                    >
                      {performer.availability || "Боломжтой"}
                    </div>
                  </div>

                  {/* Performer Info */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-1">{performer.name}</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {performer.performance_type || performer.genre}
                    </p>

                    {/* Viberate Popularity & Price */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaStar className="text-yellow-400" />
                        <span className="font-semibold">
                          {performer.popularity
                            ? Number(performer.popularity).toLocaleString()
                            : "N/A"}
                        </span>
                        <span className="text-xs text-gray-400">Viberate</span>
                      </div>
                      <div className="text-lg font-bold text-blue-400">
                        {Number(performer.price).toLocaleString()}₮
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/performers/${performer.id}`)
                        }
                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors border border-blue-600"
                      >
                        Профайл үзэх
                      </button>
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                        Захиалах
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {sortedPerformers.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">
                    Уучлаарай, уран бүтээлч олдсонгүй
                  </div>
                  <div className="text-gray-500 text-sm">
                    Шүүлтүүрийг өөрчилж дахин оролдоно уу
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
