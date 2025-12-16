/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { X, Calendar, Clock, Download } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DateFormProps {
  selected: { date: string; type: "am" | "pm" | "udur" }[];
  setSelected: React.Dispatch<
    React.SetStateAction<{ date: string; type: "am" | "pm" | "udur" }[]>
  >;
  hallId: number | string;
  eventHallData: any;
}

export default function DateForm({
  selected,
  setSelected,
  hallId,
  eventHallData,
}: DateFormProps) {
  const router = useRouter();
  const [prices, setPrices] = useState<{
    am: number;
    pm: number;
    udur: number;
  }>({
    am: 0,
    pm: 0,
    udur: 0,
  });
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [bookingId, setBookingId] = useState<string>("");
  const [isPolling, setIsPolling] = useState(false);
  const typeLabels = {
    am: "Өглөө (08:00-12:00)",
    pm: "Орой (18:00-22:00)",
    udur: "Өдөр (09:00-18:00)",
  };
  const slotPrices = {
    am: eventHallData.price[0],
    pm: eventHallData.price[1],
    udur: eventHallData.price[2],
  };

  const totalPrice = selected.reduce(
    (sum, sel) => sum + slotPrices[sel.type],
    0
  );
  const getPrices = async () => {
    try {
      const res = await fetch(`/api/event-halls/prices?hallId=${hallId}`);
      const data = await res.json();

      const mapped = {
        am: data.price?.[0] ?? 0,
        pm: data.price?.[1] ?? 0,
        udur: data.price?.[2] ?? 0,
      };

      setPrices(mapped);
    } catch (err) {
      console.error("Error fetching prices:", err);
    }
  };
  useEffect(() => {
    if (!hallId) return;
    getPrices();
  }, [hallId]);

  // Poll for QR scan notifications
  useEffect(() => {
    if (!isPolling || !bookingId) return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/qr-scan-notify?bookingId=${bookingId}`
        );
        const data = await response.json();

        if (data.success && data.notification) {
          // Phone scanned the QR code! Wait a moment for DB to update, then redirect
          setIsPolling(false);
          setQrDialogOpen(false);

          // Give the server 500ms to update the booking status to "approved"
          setTimeout(() => {
            router.push(
              `/booking-response?bookingId=${data.notification.bookingId}&hallId=${data.notification.hallId}&totalPrice=${data.notification.totalPrice}`
            );
          }, 500);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000); // Poll every 2 seconds

    return () => {
      clearInterval(pollInterval);
    };
  }, [isPolling, bookingId, router]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const calculateTotalPrice = () => {
    return selected.reduce((total, sel) => total + prices[sel.type], 0);
  };

  const removeSelection = (date: string, type: "am" | "pm" | "udur") => {
    setSelected((prev) =>
      prev.filter((s) => !(s.date === date && s.type === type))
    );
  };

  const handleSubmit = async () => {
    // 1️⃣ Сонгосон өдөр шалгах
    if (selected.length === 0) return alert("Өдөр сонгоно уу");

    // 2️⃣ Token шалгах
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Захиалга хийхийн тулд эхлээд нэвтэрнэ үү.");
      return;
    }

    // 3️⃣ POST хийх өгөгдөл
    const bookingData = {
      hallId,
      bookings: selected,
      status: "pending", // Start as pending, will be approved after QR scan
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // token-г header-д нэмнэ
        },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        const responseData = await res.json();
        // Extract the first booking ID from the bookings array
        const firstBooking = responseData.bookings?.[0];
        const bookingIdentifier =
          firstBooking?.id?.toString() ||
          responseData.id ||
          responseData.bookingId ||
          Date.now().toString();

        // Generate QR code with URL to qr-scan page (phone will scan this)
        // Use actual hostname instead of localhost for phone access
        const hostname = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;

        // If localhost, try to use local network IP (user should access via IP, not localhost)
        let baseUrl = window.location.origin;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
          // Show alert to user
          toast.info(
            `Утаснаас хандахын тулд компьютерийн IP хаягаар нэвтэрнэ үү (жишээ нь: ${protocol}//192.168.1.x:${port})`
          );
          // Still use the origin, but user needs to access site via IP first
          baseUrl = window.location.origin;
        }

        const bookingUrl = `${baseUrl}/qr-scan?bookingId=${bookingIdentifier}&hallId=${hallId}&totalPrice=${calculateTotalPrice()}`;

        // Generate QR code
        try {
          const qrUrl = await QRCode.toDataURL(bookingUrl, {
            width: 300,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });

          setQrCodeUrl(qrUrl);
          setBookingId(bookingIdentifier);
          setQrDialogOpen(true);
          setIsPolling(true); // Start polling for phone scans

          toast.success("Захиалга амжилттай илгээгдлээ");
        } catch (qrError) {
          console.error("QR Code generation error:", qrError);
          toast.success("Захиалга амжилттай илгээгдлээ");
          router.push(`/dashboard`);
        }
      } else {
        const errData = await res.json();
        toast.error("Алдаа гарлаа: " + (errData.error || "Серверийн алдаа"));
      }
    } catch (error) {
      console.error(error);
      alert("Серверийн алдаа гарлаа");
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `booking-${bookingId}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR код татагдлаа");
  };

  const handleCloseQRDialog = () => {
    setQrDialogOpen(false);
    setIsPolling(false); // Stop polling
    router.push(`/dashboard`);
  };

  return (
    <>
      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Захиалга амжилттай!</DialogTitle>
            <DialogDescription>
              Утсаараа QR кодыг уншуулбал захиалгын дэлгэрэнгүй мэдээлэл энэ
              компьютер дээр харагдана.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-4">
            {qrCodeUrl && (
              <div className="bg-white p-4 rounded-lg">
                <img
                  src={qrCodeUrl}
                  alt="Booking QR Code"
                  className="w-64 h-64"
                />
              </div>
            )}

            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Захиалгын дугаар</p>
              <p className="text-xs text-muted-foreground font-mono">
                #{bookingId}
              </p>
            </div>

            <div className="w-full space-y-2 text-sm text-muted-foreground">
              <p>• Утсаараа QR код уншуулна уу</p>
              <p>• Захиалгын дэлгэрэнгүй энэ компьютер дээр харагдана</p>
              <p>• QR кодыг татаж хадгалж болно</p>
            </div>

            {isPolling && (
              <div className="flex items-center gap-2 text-sm text-blue-500 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Утасны QR скан хүлээж байна...</span>
              </div>
            )}

            {(window.location.hostname === "localhost" ||
              window.location.hostname === "127.0.0.1") && (
              <div className="w-full text-xs text-amber-600 bg-amber-500/10 px-3 py-2 rounded border border-amber-500/20">
                ⚠️ Анхааруулга: localhost ашиглаж байна. Утаснаас ажиллуулахын
                тулд компьютерийн IP хаягаар (жишээ: 192.168.1.x:3000) нэвтэрнэ
                үү.
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadQR}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              QR код татах
            </Button>
            <Button onClick={handleCloseQRDialog} className="w-full sm:w-auto">
              Дуусгах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="border border-neutral-800 rounded-xl p-4 lg:p-6 bg-black h-fit sticky top-6">
        <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Сонгосон цагууд
        </h3>

        {selected.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-sm">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Цаг сонгоогүй байна</p>
            <p className="text-xs mt-1">Календараас цагаа сонгоно уу</p>
          </div>
        ) : (
          <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
            {selected.map((sel, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg p-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {formatDate(sel.date)}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {typeLabels[sel.type]}
                  </p>
                </div>
                <button
                  onClick={() => removeSelection(sel.date, sel.type)}
                  className="p-1 hover:bg-neutral-800 rounded-md transition-colors"
                >
                  <X className="h-4 w-4 text-neutral-500 hover:text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {selected.length > 0 && (
          <>
            <div className="border-t border-neutral-800 pt-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Нийт сонголт</span>
                <span className="text-white font-medium">
                  {selected.length} цаг
                </span>
              </div>

              {/* Total Price */}
              <div className="flex justify-between text-sm mt-2">
                <span className="text-neutral-400">Нийт үнэ</span>
                <span className="text-white font-semibold">
                  {" "}
                  {calculateTotalPrice().toLocaleString()}₮
                </span>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-white text-black hover:bg-neutral-200 font-medium"
            >
              Захиалга баталгаажуулах
            </Button>
          </>
        )}
      </div>
    </>
  );
}
