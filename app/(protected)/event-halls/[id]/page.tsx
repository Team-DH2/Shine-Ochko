/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaPhone, FaParking } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { Edit, X } from "lucide-react";
import { toast } from "sonner";

import { CarouselMy } from "@/components/us/CarouselMy";
import BookingCalendar from "@/components/event-halls/DayCalendar";
import { LayoutFooter } from "@/components/us/LayoutFooter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EventHall {
  rating: number;
  id: number;
  name: string;
  location?: string | null;
  capacity?: string | null;
  description?: string | null;
  suitable_events: string[];
  images: string[];
  phonenumber?: string | null;
  menu: string[];
  parking_capacity?: number | null;
  additional_informations: string[];
  informations_about_hall: string[];
  advantages: string[];
  localtion_link?: string;
}

type DialogType =
  | "images"
  | "contact"
  | "description"
  | "additional"
  | "suitable"
  | "hall_info"
  | null;

export default function SelectedEventHall() {
  const params = useParams();
  const router = useRouter();
  const eventHallId = params.id as string;

  const [eventHallData, setEventHallData] = useState<EventHall | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<DialogType>(null);
  const [editData, setEditData] = useState<any>({});

  const getSelectedEventHall = useCallback(async () => {
    if (!eventHallId) return;
    try {
      const res = await fetch(`/api/selected-event-hall`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventHallId }),
      });
      const data = await res.json();
      setEventHallData(data.data);
      console.log(data.data);
    } catch (error) {
      console.error("Error fetching event hall:", error);
    }
  }, [eventHallId]);

  const checkOwnership = useCallback(async () => {
    if (!eventHallId) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsOwner(false);
        return;
      }

      const res = await fetch("/api/hallowner/my-halls", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setIsOwner(false);
        return;
      }

      const data = await res.json();

      if (data.halls && Array.isArray(data.halls)) {
        const ownsThisHall = data.halls.some(
          (hall: { id: number }) => hall.id === Number(eventHallId)
        );
        setIsOwner(ownsThisHall);
        console.log("Is owner:", ownsThisHall, "Hall ID:", eventHallId);
      }
    } catch (error) {
      console.error("Error checking ownership:", error);
      setIsOwner(false);
    }
  }, [eventHallId]);

  useEffect(() => {
    getSelectedEventHall();
    checkOwnership();
  }, [getSelectedEventHall, checkOwnership]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/hallowner/my-halls/${eventHallId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        toast.success("Амжилттай хадгалагдлаа!");
        setDialogOpen(null);
        getSelectedEventHall(); // Refresh data
      } else {
        toast.error("Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Алдаа гарлаа");
    }
  };

  const openDialog = (type: DialogType, initialData: any) => {
    setEditData(initialData);
    setDialogOpen(type);
  };

  return (
    <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
      {/* Carousel Section */}
      {eventHallData && eventHallData.images.length > 0 && (
        <section className="h-screen snap-start relative">
          {isOwner && (
            <button
              onClick={() =>
                openDialog("images", { images: eventHallData.images })
              }
              className="absolute bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg"
            >
              <Edit className="w-4 h-4" />
              Засах
            </button>
          )}
          <CarouselMy
            halls={[
              {
                id: eventHallData.id,
                name: eventHallData.name,
                title: eventHallData.name,
                description: eventHallData.description || "",
                duureg: "",
                rating: eventHallData.rating || 0,
                images: eventHallData.images,
              },
            ]}
          />
        </section>
      )}

      {/* Basic Info Section */}
      <section className="min-h-screen snap-start bg-black flex items-center justify-center flex-col py-12">
        <div className="max-w-6xl w-full px-6 space-y-6 text-white">
          {/* Location & Contact Info */}
          <div className="bg-neutral-900 rounded-lg p-6 border border-blue-600/20 hover:border-blue-600/40 transition-colors relative">
            {isOwner && (
              <button
                onClick={() =>
                  openDialog("contact", {
                    location: eventHallData?.location,
                    phonenumber: eventHallData?.phonenumber,
                    capacity: eventHallData?.capacity,
                    menu: eventHallData?.menu,
                    parking_capacity: eventHallData?.parking_capacity,
                    location_link: eventHallData?.localtion_link,
                  })
                }
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Засах
              </button>
            )}
            <div className="flex flex-col gap-4">
              <div className="flex gap-5 items-center">
                <FaMapMarkerAlt size={24} className="text-blue-600" />
                <span>{eventHallData?.location}</span>
                {eventHallData?.localtion_link && (
                  <a
                    href={eventHallData.localtion_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 underline transition-colors"
                  >
                    Show on map
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-10 mt-2">
                <div className="flex items-center gap-2">
                  <FaPhone className="text-blue-600" />
                  <strong>Утас:</strong> {eventHallData?.phonenumber}
                </div>
                <div className="flex items-center gap-2">
                  <FaPeopleGroup size={24} className="text-blue-600" />
                  <strong>Хүчин чадал:</strong> {eventHallData?.capacity}
                </div>
                <div className="flex items-center gap-2">
                  <MdOutlineRestaurantMenu
                    size={24}
                    className="text-blue-600"
                  />
                  <strong>Меню:</strong> {eventHallData?.menu.join(", ")}
                </div>
                <div className="flex items-center gap-2">
                  <FaParking size={24} className="text-blue-600" />
                  <strong>Машины зогсоол:</strong>{" "}
                  {eventHallData?.parking_capacity}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Advantages */}
          <div className="bg-neutral-900 rounded-lg p-6 border border-blue-600/20 hover:border-blue-600/40 transition-colors relative">
            {isOwner && (
              <button
                onClick={() =>
                  openDialog("description", {
                    description: eventHallData?.description,
                    advantages: eventHallData?.advantages,
                  })
                }
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Засах
              </button>
            )}
            <p className="text-gray-200">{eventHallData?.description}</p>
            <ul className="pl-6 space-y-2 mt-4">
              {eventHallData?.advantages?.map((adv, idx) => (
                <li key={idx} className="flex gap-2 items-center">
                  <IoMdCheckmarkCircleOutline
                    className="text-blue-600 shrink-0"
                    size={20}
                  />
                  <span className="text-gray-200">{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Three Column Info Section */}
        <div className="max-w-6xl w-full px-6 mt-6 flex flex-col lg:flex-row gap-6 text-white">
          {/* Additional Info */}
          <div className="flex-1 bg-neutral-900 rounded-lg p-6 border border-blue-600/20 hover:border-blue-600/40 transition-colors relative">
            {isOwner && (
              <button
                onClick={() =>
                  openDialog("additional", {
                    additional_informations:
                      eventHallData?.additional_informations,
                  })
                }
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Засах
              </button>
            )}
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-4">
              Нэмэлт мэдээлэл
            </h3>
            <ul className="space-y-2">
              {eventHallData?.additional_informations?.map((info, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <IoMdCheckmarkCircleOutline
                    className="text-blue-600 shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-gray-200">{info}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suitable Events */}
          <div className="flex-1 bg-neutral-900 rounded-lg p-6 border border-blue-600/20 hover:border-blue-600/40 transition-colors relative">
            {isOwner && (
              <button
                onClick={() =>
                  openDialog("suitable", {
                    suitable_events: eventHallData?.suitable_events,
                  })
                }
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Засах
              </button>
            )}
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-4">
              Тохиромжтой хүлээн авалтууд
            </h3>
            <ul className="space-y-2">
              {eventHallData?.suitable_events?.map((event, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <IoMdCheckmarkCircleOutline
                    className="text-blue-600 shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-gray-200">{event}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hall Info */}
          <div className="flex-1 bg-neutral-900 rounded-lg p-6 border border-blue-600/20 hover:border-blue-600/40 transition-colors relative">
            {isOwner && (
              <button
                onClick={() =>
                  openDialog("hall_info", {
                    informations_about_hall:
                      eventHallData?.informations_about_hall,
                  })
                }
                className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Засах
              </button>
            )}
            <h3 className="text-2xl font-bold border-b-2 border-blue-600 pb-2 mb-4">
              Танхимын мэдээлэл
            </h3>
            <ul className="space-y-2">
              {eventHallData?.informations_about_hall?.map((info, idx) => (
                <li key={idx} className="flex gap-2 items-start">
                  <IoMdCheckmarkCircleOutline
                    className="text-blue-600 shrink-0 mt-0.5"
                    size={20}
                  />
                  <span className="text-gray-200">{info}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="min-h-screen snap-start flex items-center justify-center bg-black py-12">
        <div className="w-full max-w-7xl px-6 mt-3 relative">
          <BookingCalendar
            hallId={eventHallId}
            isOwner={isOwner}
            onEditCalendar={() => openDialog("images", { images: eventHallData?.images })}
          />
        </div>
      </section>
      <LayoutFooter />

      {/* Edit Dialogs */}
      <Dialog
        open={dialogOpen === "contact"}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent className="bg-neutral-900 text-white border-blue-600/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Холбоо барих мэдээлэл засах</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70">Байршил</label>
              <Input
                value={editData.location || ""}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Утасны дугаар</label>
              <Input
                value={editData.phonenumber || ""}
                onChange={(e) =>
                  setEditData({ ...editData, phonenumber: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Хүчин чадал</label>
              <Input
                value={editData.capacity || ""}
                onChange={(e) =>
                  setEditData({ ...editData, capacity: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Машины зогсоол</label>
              <Input
                type="number"
                value={editData.parking_capacity || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    parking_capacity: Number(e.target.value),
                  })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-white/70">Байршлын линк</label>
              <Input
                value={editData.location_link || ""}
                onChange={(e) =>
                  setEditData({ ...editData, location_link: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(null)}
                className="text-black bg-white border-white/20 hover:bg-gray-200"
              >
                Цуцлах
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Хадгалах
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen === "description"}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent className="bg-neutral-900 text-white border-blue-600/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Тайлбар засах</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70">Тайлбар</label>
              <Textarea
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
              />
            </div>
            <div>
              <label className="text-sm text-white/70">
                Давуу тал (таслалаар тусгаарлана)
              </label>
              <Textarea
                value={editData.advantages?.join("\n") || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    advantages: e.target.value
                      .split("\n")
                      .filter((s: string) => s.trim()),
                  })
                }
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
                placeholder="Мөр бүр нэг давуу тал"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(null)}
                className="text-black bg-white border-white/20 hover:bg-gray-200"
              >
                Цуцлах
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Хадгалах
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen === "additional"}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent className="bg-neutral-900 text-white border-blue-600/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Нэмэлт мэдээлэл засах</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70">
                Нэмэлт мэдээлэл (мөр бүр нэг мэдээлэл)
              </label>
              <Textarea
                value={editData.additional_informations?.join("\n") || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    additional_informations: e.target.value
                      .split("\n")
                      .filter((s: string) => s.trim()),
                  })
                }
                className="bg-white/5 border-white/10 text-white min-h-[200px]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(null)}
                className="text-black bg-white border-white/20 hover:bg-gray-200"
              >
                Цуцлах
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Хадгалах
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen === "suitable"}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent className="bg-neutral-900 text-white border-blue-600/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Тохиромжтой хүлээн авалтууд засах</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70">
                Хүлээн авалтууд (мөр бүр нэг төрөл)
              </label>
              <Textarea
                value={editData.suitable_events?.join("\n") || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    suitable_events: e.target.value
                      .split("\n")
                      .filter((s: string) => s.trim()),
                  })
                }
                className="bg-white/5 border-white/10 text-white min-h-[200px]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(null)}
                className="text-black bg-white border-white/20 hover:bg-gray-200"
              >
                Цуцлах
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Хадгалах
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen === "hall_info"}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent className="bg-neutral-900 text-white border-blue-600/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Танхимын мэдээлэл засах</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70">
                Танхимын мэдээлэл (мөр бүр нэг мэдээлэл)
              </label>
              <Textarea
                value={editData.informations_about_hall?.join("\n") || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    informations_about_hall: e.target.value
                      .split("\n")
                      .filter((s: string) => s.trim()),
                  })
                }
                className="bg-white/5 border-white/10 text-white min-h-[200px]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(null)}
                className="text-black bg-white border-white/20 hover:bg-gray-200"
              >
                Цуцлах
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Хадгалах
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen === "images"}
        onOpenChange={() => setDialogOpen(null)}
      >
        <DialogContent className="bg-neutral-900 text-white border-blue-600/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Зургууд засах</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70">
                Зургийн URL-ууд (мөр бүр нэг URL)
              </label>
              <Textarea
                value={editData.images?.join("\n") || ""}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    images: e.target.value
                      .split("\n")
                      .filter((s: string) => s.trim()),
                  })
                }
                className="bg-white/5 border-white/10 text-white min-h-[200px]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(null)}
                className="text-black bg-white border-white/20 hover:bg-gray-200"
              >
                Цуцлах
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Хадгалах
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
