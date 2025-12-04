"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrashIcon } from "lucide-react";
import { Header } from "@/components/us/Header";

export default function EventHallForm() {
  const [name, setName] = useState<string>("");
  const [hallName, setHallName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Add image
  const handleAddImage = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    if (index === images.length) {
      setImages([...newImages]);
    }
  };

  // Delete image
  const deleteImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const base64Images = await Promise.all(
        images.map(async (img) => {
          const arrayBuffer = await img.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          return `data:${img.type};base64,${buffer.toString("base64")}`;
        })
      );

      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          hallName,
          location,
          number,
          email,
          images: base64Images,
        }),
      });

      const data = await response.json();
      alert(data.message);

      setName("");
      setHallName("");
      setLocation("");
      setNumber("");
      setEmail("");
      setImages([]);
    } catch (error) {
      console.log(error);
      alert("Aldaaa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  from-neutral-900 via-neutral-800 to-neutral-900 p-6">
      <div className="relative p-1 rounded-3xl bg-linear-to-r from-rose-500/50 via-purple-500/50 to-indigo-500/50 shadow-[0_0_40px_-10px_rgba(255,0,150,0.5)]">
        <div className="bg-neutral-900/70 backdrop-blur-2xl rounded-3xl p-10 w-120 space-y-8">
          {/* Event Hall */}
          <h1 className="text-4xl font-bold text-center bg-linear-to-r from-rose-300 to-purple-300 bg-clip-text text-transparent drop-shadow">
            ✨ Event Hall
          </h1>

          <form className="space-y-6">
            {/* Холбоо барих хүний нэр */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Холбоо барих хүний нэр *
              </div>
              <Input
                type="name"
                className="h-12 rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
                placeholder="Холбоо барих хүний нэр"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Заалны нэр */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Заалны нэр *
              </div>
              <Input
                className="h-12 rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
                placeholder="Заалны нэр"
                value={hallName}
                onChange={(e) => setHallName(e.target.value)}
              />
            </div>

            {/* "Хаяг / Байршил" */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                "Хаяг / Байршил" *
              </div>
              <Textarea
                className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
                placeholder="УБ, ХУД…"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Холбоо барих утас */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                Холбоо барих утас *
              </div>
              <Input
                className="h-12 rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
                placeholder="9999-9999"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>

            {/* И-мэйл хаяг */}
            <div className="space-y-2">
              <div className="text-neutral-300 font-medium text-sm">
                И-мэйл хаяг *
              </div>
              <Input
                className="h-12 rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="text-neutral-300 font-medium text-sm">
                Зургууд *
              </div>

              {images.map((img, i) => (
                <div key={i} className="space-y-2">
                  {img ? (
                    <div className="flex items-start gap-2">
                      <Image
                        src={URL.createObjectURL(img)}
                        alt="Image"
                        width={200}
                        height={140}
                        className="rounded-xl border border-neutral-500/40 "
                      />
                      <TrashIcon
                        onClick={() => deleteImage(i)}
                        className="text-neutral-300 relative cursor-pointer hover:text-red-500 transition"
                        size={22}
                      />
                    </div>
                  ) : null}
                </div>
              ))}

              <Input
                className="h-[138px] border-2 border-dashed bg-neutral-700/30 border-neutral-500/40 rounded-md text-sm font-medium mx-auto "
                id="picture"
                type="file"
                accept="image/*"
                onChange={(e) => handleAddImage(e, images.length)}
              />
            </div>

            {/*  */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-linear-to-r from-rose-600 to-purple-600 hover:brightness-110 hover:scale-[1.02] transition-all shadow-xl"
              onClick={handleSubmit}
            >
              {loading ? "Burtgej baina......" : " Burtguuleh"}
            </Button>
          </form>

          {/* <div className="text-center text-neutral-300">эсвэл</div> */}
          <Link href="/home">
            <Button className="w-full h-12 bg-white rounded-xl text-black text-lg border-neutral-500/40 hover:bg-neutral-700/40 transition">
              🏠 Нүүр хуудас руу буцах
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
