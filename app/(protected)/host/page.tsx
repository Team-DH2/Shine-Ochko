"use client";

import HostCard from "@/components/event-halls/Hosts";
import { Header } from "@/components/us/Header";
import { useEffect, useState } from "react";

type HostDB = {
  id: number;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  title: string;
  image: string;
  tags: string[];
  rating: number;
  status: "Available" | "Booked" | "Inquire";
};

export default function Host() {
  const [search, setSearch] = useState("");

  const [hosts, setHosts] = useState<HostDB[]>([]);

  useEffect(() => {
    fetch("/api/hosts")
      .then((res) => res.json())
      .then((data) => setHosts(data));
  }, []);
  if (!hosts) {
    return null;
  }
  console.log({ hosts });

  return (
    <div className="min-h-screen bg-[#09090D] text-white px-[128px]  ">
      <Header />
      <h1 className="text-3xl font-bold mb-6 pt-[108px] pb-[72px] flex justify-center">
        Discover Your Ideal Host or MC
      </h1>

      <div className="bg-[#32374380] rounded-2xl pr-[33px] ">
        <div className="p-[33px]  flex gap-8">
          <input
            className="w-[500px] py-0.5 px-2 bg-[#262A33FF]"
            placeholder="Search hosts or MCs..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="bg-black rounded-2xl py-0.5 px-2">Specialization</div>

          <div className="bg-black rounded-2xl py-0.5 px-2">Availability</div>
        </div>

        <div className="flex justify-between ">
          <div className="px-[33px] pb-8 flex items-center gap-2">
            <div>Rate range:</div>
            <input
              className="w-20 bg-[#262A33FF] pl-4 "
              placeholder="min"
              type="number"
            />
            <div>-</div>
            <input
              className="w-20 bg-[#262A33FF] pl-4"
              placeholder="max"
              type="number"
            />
          </div>
          <div className="bg-blue-700 h-8 rounded-2xl px-1.5 pt-1">
            Apply filters
          </div>
        </div>
      </div>

      <div className="pt-12 pb-8 flex gap-4 flex-wrap">
        {hosts.map((host) => (
          <HostCard
            key={host.id}
            host={{
              id: host.id,
              name: host.name,
              title: host.title,
              image: host.image,
              rating: host.rating,
              status: host.status,
              tags: host.tags,
            }}
          />
        ))}
      </div>
    </div>
  );
}
