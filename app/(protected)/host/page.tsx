"use client";

import HostCard from "@/components/us/Host";
import { Header } from "@/components/us/Header";
import { useEffect, useState } from "react";
import { LuUserRoundSearch } from "react-icons/lu";
import { IoIosPricetags } from "react-icons/io";
import { MdCalendarMonth } from "react-icons/md";
import { MdOutlinePriceChange } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { VscDebugRestart } from "react-icons/vsc";

type HostDB = {
  id: number;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  title: string;
  image: string;
  tags: string[];
  rating: number;
  status: "Боломжтой" | "Захиалагдсан" | "Хүлээгдэж байна";
  price: number;
};

export default function Host() {
  const [search, setSearch] = useState("");
  const [minRate, setMinRate] = useState<number | null>(null);
  const [maxRate, setMaxRate] = useState<number | null>(null);

  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [hosts, setHosts] = useState<HostDB[]>([]);
  const [filteredHosts, setFilteredHosts] = useState<HostDB[]>([]);

  useEffect(() => {
    fetch("/api/hosts")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a: HostDB, b: HostDB) => b.rating - a.rating);
        setHosts(sorted);
        setFilteredHosts(sorted);
      });
  }, []);

  const handleFilter = () => {
    let result = [...hosts];

    // SEARCH
    if (search.trim() !== "") {
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(search.toLowerCase()) ||
          h.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // RATING MIN/MAX
    if (minRate !== null) result = result.filter((h) => h.rating >= minRate);
    if (maxRate !== null) result = result.filter((h) => h.rating <= maxRate);

    // PRICE RANGE
    if (minPrice !== null) result = result.filter((h) => h.price >= minPrice);
    if (maxPrice !== null) result = result.filter((h) => h.price <= maxPrice);

    // TAG FILTER
    if (selectedTag !== "all") {
      result = result.filter((h) => h.tags.includes(selectedTag));
    }

    // STATUS FILTER
    if (selectedStatus !== "all") {
      result = result.filter((h) => h.status === selectedStatus);
    }

    setFilteredHosts(result);
  };

  const handleReset = () => {
    setSearch("");
    setMinRate(null);
    setMaxRate(null);
    setMinPrice(null);
    setMaxPrice(null);
    setSelectedTag("all");
    setSelectedStatus("all");

    setFilteredHosts(hosts);
  };

  return (
    <div className="min-h-screen bg-[#09090D] text-white px-32">
      <Header />

      <h1 className="text-3xl font-bold mb-6 pt-[108px] pb-[72px] flex justify-center">
        Discover Your Ideal Host or MC
      </h1>

      {/* FILTER CARD */}
      <div className="bg-[#32374380] rounded-2xl pr-[33px]">
        <div className="p-[33px] flex gap-8">
          {/* SEARCH BAR */}
          <div className="flex items-center gap-3 bg-[#262A33FF] rounded-full px-4 w-[300px]">
            <LuUserRoundSearch />
            <input
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
              placeholder="Хөтлөгч хайх..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex gap-6">
            {/* TAG FILTER */}
            <div className="bg-black flex items-center gap-2 rounded-2xl py-1 px-4">
              <IoIosPricetags />
              <select
                className="bg-transparent outline-none"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="all">Бүгд</option>
                <option value="Телевизийн хөтлөгч">Телевизийн хөтлөгч</option>
                <option value="Комеди">Комеди</option>
                <option value="Эвент">Эвент</option>
                <option value="Энтертайнмент">Энтертайнмент</option>
              </select>
            </div>

            {/* STATUS FILTER */}
            <div className="bg-black flex items-center gap-2 rounded-2xl py-1 px-4">
              <MdCalendarMonth />
              <select
                className="bg-transparent outline-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Бүгд</option>
                <option value="Боломжтой">Боломжтой</option>
                <option value="Захиалагдсан">Захиалагдсан</option>
                <option value="Хүлээгдэж байна">Хүлээгдэж байна</option>
              </select>
            </div>

            <div
              className="bg-black flex items-center gap-2 rounded-2xl py-1 px-5 cursor-pointer hover:bg-gray-800"
              onClick={handleReset}
            >
              <VscDebugRestart />
            </div>

            {/* PRICE RANGE */}
            <div className="bg-black  gap-2 rounded-2xl  py-1 px-4">
              <div className="flex items-center gap-2">
                <MdOutlinePriceChange />
                <p>Үнэ</p>
              </div>

              <div>
                <input
                  type="range"
                  min="2000000"
                  max="10000000"
                  step="50000"
                  value={minPrice ?? 2000000}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />

                <div className="text-sm text-gray-400 ">
                  Хамгийн бага: {minPrice?.toLocaleString()} ₮
                </div>
              </div>
            </div>

            {/* RESET BUTTON */}
          </div>
        </div>

        {/* RATING FILTER */}
        <div className="flex justify-between">
          <div className="px-[33px] pb-8 flex items-center gap-2">
            <div>Үнэлгээ:</div>

            <input
              className="w-20 bg-[#262A33FF] rounded-md px-2"
              placeholder="min"
              type="number"
              value={minRate ?? ""}
              onChange={(e) => setMinRate(Number(e.target.value))}
            />

            <div>-</div>

            <input
              className="w-20 bg-[#262A33FF] rounded-md px-2"
              placeholder="max"
              type="number"
              value={maxRate ?? ""}
              onChange={(e) => setMaxRate(Number(e.target.value))}
            />
          </div>

          <div
            onClick={handleFilter}
            className="bg-blue-700 cursor-pointer h-8 flex items-center gap-2 justify-center rounded-2xl px-6 hover:bg-blue-800"
          >
            <FiSearch />
            Хайх
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="pt-12 pb-8 flex gap-4 flex-wrap">
        {filteredHosts.map((host) => (
          <HostCard key={host.id} host={host} />
        ))}
      </div>
    </div>
  );
}
