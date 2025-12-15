"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/us/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";

export default function EditHallPage() {
  const router = useRouter();
  const params = useParams();
  const hallId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hall, setHall] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    description: "",
    phonenumber: "",
    location_link: "",
    duureg: "",
    parking_capacity: 0,
    rating: "",
  });

  useEffect(() => {
    fetchHall();
  }, [hallId]);

  const fetchHall = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/home");
        return;
      }

      const res = await fetch(`/api/hallowner/my-halls/${hallId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setHall(data.hall);
        setFormData({
          name: data.hall.name || "",
          location: data.hall.location || "",
          capacity: data.hall.capacity || "",
          description: data.hall.description || "",
          phonenumber: data.hall.phonenumber || "",
          location_link: data.hall.location_link || "",
          duureg: data.hall.duureg || "",
          parking_capacity: data.hall.parking_capacity || 0,
          rating: data.hall.rating || "",
        });
      } else {
        router.push("/hallowner-dashboard");
      }
    } catch (error) {
      console.error("Error fetching hall:", error);
      router.push("/hallowner-dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/hallowner/my-halls/${hallId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Амжилттай хадгалагдлаа!");
        router.push("/hallowner-dashboard");
      } else {
        alert("Алдаа гарлаа. Дахин оролдоно уу.");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#0A0A0F] via-[#0F0F14] to-[#0A0A0F] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-r-2 border-blue-400/30 mx-auto mb-6"></div>
          <p className="text-white/40 text-sm animate-pulse">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-[#0A0A0F] via-[#0F0F14] to-[#0A0A0F] min-h-screen text-white">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl pt-24">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-400 transition-all duration-300 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Буцах</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white/80 mb-2">
            Танхим засах
          </h1>
          <p className="text-white/40 text-sm">
            Танхимынхаа мэдээллийг шинэчлэх
          </p>
        </div>

        <div className="bg-white/2 rounded-3xl p-6 md:p-8 border border-white/5 backdrop-blur-md shadow-2xl shadow-black/50">
          <div className="space-y-6">
            {/* Name */}
            <div className="group">
              <label className="block text-sm font-medium mb-2 text-white/50 group-focus-within:text-white/70 transition-colors">
                Нэр *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-white/3 border-white/8 text-white placeholder:text-white/25 focus:border-blue-500/30 focus:bg-white/5 transition-all"
                placeholder="Танхимын нэр"
              />
            </div>

            {/* Location */}
            <div className="group">
              <label className="block text-sm font-medium mb-2 text-white/50 group-focus-within:text-white/70 transition-colors">
                Байршил
              </label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="bg-white/3 border-white/8 text-white placeholder:text-white/25 focus:border-blue-500/30 focus:bg-white/5 transition-all"
                placeholder="Хаяг"
              />
            </div>

            {/* Capacity */}
            <div className="group">
              <label className="block text-sm font-medium mb-2 text-white/50 group-focus-within:text-white/70 transition-colors">
                Багтаамж
              </label>
              <Input
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                className="bg-white/3 border-white/8 text-white placeholder:text-white/25 focus:border-blue-500/30 focus:bg-white/5 transition-all"
                placeholder="Хүний тоо"
              />
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-sm font-medium mb-2 text-white/50 group-focus-within:text-white/70 transition-colors">
                Тайлбар
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-white/3 border-white/8 text-white placeholder:text-white/25 focus:border-blue-500/30 focus:bg-white/5 transition-all min-h-32 resize-none"
                placeholder="Танхимын тухай дэлгэрэнгүй мэдээлэл"
              />
            </div>

            {/* Phone */}
            <div className="group">
              <label className="block text-sm font-medium mb-2 text-white/50 group-focus-within:text-white/70 transition-colors">
                Утасны дугаар
              </label>
              <Input
                value={formData.phonenumber}
                onChange={(e) =>
                  setFormData({ ...formData, phonenumber: e.target.value })
                }
                className="bg-white/3 border-white/8 text-white placeholder:text-white/25 focus:border-blue-500/30 focus:bg-white/5 transition-all"
                placeholder="99001122"
              />
            </div>

            {/* District */}
            <div className="group">
              <label className="block text-sm font-medium mb-2 text-white/50 group-focus-within:text-white/70 transition-colors">
                Дүүрэг
              </label>
              <Input
                value={formData.duureg}
                onChange={(e) =>
                  setFormData({ ...formData, duureg: e.target.value })
                }
                className="bg-white/3 border-white/8 text-white placeholder:text-white/25 focus:border-blue-500/30 focus:bg-white/5 transition-all"
                placeholder="Дүүргийн нэр"
              />
            </div>

            {/* Parking */}
            <div className="group">
              <label className="block text-sm font-medium mb-2 text-white/50 group-focus-within:text-white/70 transition-colors">
                Зогсоолын багтаамж
              </label>
              <Input
                type="number"
                value={formData.parking_capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parking_capacity: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-white/3 border-white/8 text-white placeholder:text-white/25 focus:border-blue-500/30 focus:bg-white/5 transition-all"
                placeholder="0"
              />
            </div>

            {/* Location Link */}
            <div className="group">
              <label className="block text-sm font-medium mb-2 text-white/50 group-focus-within:text-white/70 transition-colors">
                Байршлын холбоос
              </label>
              <Input
                value={formData.location_link}
                onChange={(e) =>
                  setFormData({ ...formData, location_link: e.target.value })
                }
                className="bg-white/3 border-white/8 text-white placeholder:text-white/25 focus:border-blue-500/30 focus:bg-white/5 transition-all"
                placeholder="Google Maps линк"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-white/5 mt-8">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 py-6 text-base transition-all duration-300 shadow-lg shadow-blue-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="bg-white/3 border-white/8 hover:bg-white/5 hover:border-white/10 py-6 transition-all duration-300 min-w-[120px]"
              >
                Цуцлах
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
