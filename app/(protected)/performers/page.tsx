"use client";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Image from "next/image";
import { Filter } from "lucide-react";

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
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchPerformers();
    fetchGenres();
  }, []);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []));
  }, []);

  const fetchPerformers = async () => {
    try {
      const res = await fetch("/api/performers");
      const data = await res.json();
      setPerformers(data.performers || []);
    } catch (error) {
      console.error("Error fetching performers:", error);
    }
  };
  const HandleOnPerformerBooking = async (performerId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Захиалга хийхийн тулд эхлээд нэвтэрнэ үү.");
        return;
      }

      if (bookings.length === 0) {
        alert("Та эхлээд Event Hall захиалах шаардлагатай.");
        return;
      }

      // Хэрэглэгчийн сонгосон эхний hall
      const selectedHall = bookings[0]; // эхний захиалга
      const hallId = selectedHall.hallid;
      const starttime = selectedHall.starttime;

      console.log({ hallId, starttime });

      const res = await fetch("/api/performer-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ performerId, hallId, starttime }),
      });

      const data = await res.json();

      if (data.success) {
        alert(
          "Уран бүтээлчийг захиалах хүсэлт явууллаа. Таньд мэдэгдэл ирнэ, Dashboard хэсгээс харна уу!"
        );
      } else {
        alert(data.message || "Захиалга амжилтгүй боллоо.");
      }
    } catch (error) {
      console.error("Error booking performer:", error);
      alert("Серверийн алдаа.");
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

  const sortedPerformers = [...filteredPerformers].sort((a, b) => {
    if (sortBy === "popularity")
      return (b.popularity || 0) - (a.popularity || 0);
    if (sortBy === "price-low") return Number(a.price) - Number(b.price);
    if (sortBy === "price-high") return Number(b.price) - Number(a.price);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

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

  /** FIXED FILTER SIDEBAR (removed sticky from inside) */
  const FilterControls = ({ isPopover = false }: { isPopover?: boolean }) => (
    <div
      className={`w-full bg-neutral-900 rounded-lg flex flex-col ${
        isPopover ? "max-h-[80vh] overflow-y-auto p-3" : "p-6"
      }`}
    >
      <h2 className="text-xl font-bold text-white mb-4">
        Таны захиалсан Event hall
      </h2>

      {/* Scrollable bookings list */}
      <div className="max-h-60 overflow-y-auto pr-2 space-y-3 custom-scroll">
        {bookings.map((b: any) => (
          <div
            key={b.id}
            className="rounded-xl bg-neutral-800/60 border border-neutral-700/40 p-4 hover:bg-neutral-800/80 transition-colors backdrop-blur-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-white">
                {b.event_halls?.name ?? "Event Hall"}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${
                  b.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    : b.status === "approved"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                {b.status}
              </span>
            </div>

            {/* Details */}
            <div className="text-sm text-neutral-300 space-y-1 mb-2">
              <div>
                <span className="font-medium text-neutral-100">Өдөр:</span>{" "}
                {new Date(b.date).toLocaleDateString()}
              </div>

              <div>
                <span className="font-medium text-neutral-100">Эхлэх цаг:</span>{" "}
                {b.starttime}
              </div>
            </div>

            {/* Description */}
            <p className="text-neutral-400 text-sm mb-2 leading-relaxed">
              {b.event_description}
            </p>

            {/* Location */}
            <div className="text-neutral-500 text-sm flex items-center gap-1">
              <span>📍</span>
              <span className="truncate">{b.event_halls?.location}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <h2 className="font-bold text-white mb-4 mt-3">Шүүлтүүр</h2>

      {/* Genre */}
      <div className="mb-6">
        <h3
          className="font-semibold mb-3 flex items-center gap-2 cursor-pointer hover:text-neutral-300"
          onClick={() => setIsGenreOpen(!isGenreOpen)}
        >
          🎵 Төрөл
          {isGenreOpen ? (
            <FaChevronUp className="ml-auto" />
          ) : (
            <FaChevronDown className="ml-auto" />
          )}
        </h3>

        {isGenreOpen && (
          <div className="space-y-2">
            {genres.map((genre) => (
              <label
                key={genre}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={selectedGenres.includes(genre)}
                  onCheckedChange={(checked) =>
                    checked
                      ? setSelectedGenres([...selectedGenres, genre])
                      : setSelectedGenres(
                          selectedGenres.filter((g) => g !== genre)
                        )
                  }
                />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">Боломжтой эсэх</h3>
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedAvailability.includes(option)}
                onCheckedChange={(checked) =>
                  checked
                    ? setSelectedAvailability([...selectedAvailability, option])
                    : setSelectedAvailability(
                        selectedAvailability.filter((a) => a !== option)
                      )
                }
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Popularity */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">Алдартай байдал</h3>
        <input
          type="range"
          min="0"
          max="100000"
          step="5000"
          value={minPopularity}
          onChange={(e) => setMinPopularity(parseFloat(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="text-sm text-gray-400 mt-2">
          Хамгийн бага: {minPopularity.toLocaleString()}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">Үнийн хүрээ</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Хамгийн бага:
            </label>
            <select
              value={minPrice}
              onChange={(e) => setMinPrice(parseInt(e.target.value))}
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded-lg border border-neutral-700"
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
              className="w-full bg-neutral-800 text-white px-3 py-2 rounded-lg border border-neutral-700"
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
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        Шүүлтүүр цэвэрлэх
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-black text-white px-4 sm:px-8 pt-28">
      <div className="flex gap-8">
        {/* FIXED SIDEBAR */}
        <div className="w-80 shrink-0 hidden lg:block">
          <div className="sticky top-28">
            <FilterControls isPopover={false} />
          </div>
        </div>

        {/* Performer Grid */}
        <div className="flex-1 w-full">
          <div className="flex justify-between">
            <h1 className="text-4xl font-bold mb-8">Уран бүтээлчид хайх</h1>
            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">Эрэмбэлэх:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="popularity">Алдартай байдал</option>
                <option value="price-high">Үнэ: Ихээс бага</option>
                <option value="price-low">Үнэ: Багаас их</option>
                <option value="name">Нэр</option>
              </select>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">
              Уран бүтээлчид хайх
            </h1>

            {/* Mobile Popover */}
            <div className="lg:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="gap-2 bg-white text-black hover:bg-neutral-200 ">
                    <Filter className="h-4 w-4" />
                    Шүүлтүүр
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 bg-neutral-900 text-white border border-neutral-800">
                  <FilterControls isPopover={true} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mb-4 text-gray-400 text-sm">
            {sortedPerformers.length} уран бүтээлч олдлоо
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedPerformers.map((performer) => (
              <div
                key={performer.id}
                className="bg-neutral-900 rounded-lg overflow-hidden hover:scale-[1.02] transition"
              >
                <div className="relative h-90 bg-neutral-800">
                  <Image
                    src={
                      performer.image ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={performer.name}
                    fill
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

                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{performer.name}</h3>

                  <p className="text-neutral-400 text-sm mb-3 truncate">
                    {performer.performance_type || performer.genre}
                  </p>

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

                    <div className="text-lg font-bold text-blue-600">
                      {Number(performer.price).toLocaleString()}₮
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/performers/${performer.id}`)}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-lg"
                    >
                      Профайл үзэх
                    </button>

                    <button
                      onClick={() => HandleOnPerformerBooking(performer.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    >
                      Захиалах
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {sortedPerformers.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <div className="text-neutral-400 text-lg mb-2">
                  Уучлаарай, уран бүтээлч олдсонгүй
                </div>
                <div className="text-neutral-500 text-sm">
                  Шүүлтүүрийг өөрчилж дахин оролдоно уу
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
