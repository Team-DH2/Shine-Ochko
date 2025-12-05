"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/us/Header";

type HostDetail = {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  status: string;
  tags: string[];
  email: string | null;
  phone: string | null;
};

export default function HostProfilePage() {
  const { id } = useParams();
  console.log(id);
  const [host, setHost] = useState<HostDetail | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/hosts?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        // data === array гэж үзэж байна
        const filtered = data.filter((host: any) => host.id === Number(id));

        if (filtered.length > 0) {
          setHost(filtered[0]); // зөвхөн таарсан host-г set хийж байна
        } else {
          console.warn("ID таарах host олдсонгүй");
        }
      });
  }, [id]);

  if (!host) return <div className="text-white p-10">Loading...</div>;
  console.log({ host });

  return (
    <div>
      <Header></Header>
      <div className="min-h-screen bg-[#09090D] text-white px-[80px] py-[60px] flex gap-10">
        {/* LEFT SIDE – IMAGE CARD */}

        <div className="bg-[#1E2128] p-6 rounded-xl w-[380px]">
          <img
            src={host.image}
            className="w-full h-[350px] object-cover rounded-xl"
          />

          <h2 className="text-2xl font-bold mt-4">{host.name}</h2>
          <p className="text-gray-400">{host.title}</p>

          <p className="mt-3 font-semibold text-lg">⭐ {host.rating} / 5.0</p>

          <button className="mt-6 w-full bg-blue-700 py-2 rounded-lg hover:bg-blue-800">
            Book now
          </button>
        </div>

        {/* RIGHT SIDE – DETAIL INFO */}
        <div className="flex-1 bg-[#1E2128] p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Танилцуулга</h3>
          <p className="text-gray-300 mb-6">
            Энэ хэсэгт MC эсвэл Host-ын дэлгэрэнгүй танилцуулга бичигдэнэ. Хэрэв
            хүсвэл database-д intro гэсэн талбар нэмж өгч болно.
          </p>

          <h3 className="text-xl font-semibold mb-2">Төрөл</h3>
          <div>
            {host.tags.map((item) => (
              <div
                key={item}
                className="bg-[#262A33] px-4 py-2 rounded-lg w-[200px] mb-6"
              >
                {item}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-2">Холбоо барих</h3>
          <div className="bg-[#262A33] px-4 py-2 rounded-lg">
            {host.email || "No email"}
          </div>
          <div className="bg-[#262A33] px-4 py-2 rounded-lg mt-2">
            {host.phone || "No phone"}
          </div>
        </div>
      </div>
    </div>
  );
}
