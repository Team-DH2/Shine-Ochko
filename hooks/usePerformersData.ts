import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export function usePerformers() {
  const [performers, setPerformers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPerformers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/performers");
      const data = await res.json();
      setPerformers(data.performers || []);
    } catch (error) {
      console.error("Error fetching performers:", error);
      toast.error("Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformers();
  }, []);

  return { performers, isLoading };
}

export function useGenres() {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch("/api/performers/genres");
        const data = await res.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  return genres;
}

export function useBookings(hallIdFromUrl: string | null) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const bookingRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    setIsLoadingBookings(true);
    const token = localStorage.getItem("token");

    fetch("/api/bookings", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const bookingsData = data.bookings || [];

        setBookings(bookingsData);
        setAllBookings(bookingsData);

        // Auto-select booking based on URL parameter
        if (hallIdFromUrl && bookingsData.length > 0) {
          const matchingBooking = bookingsData.find(
            (b: any) => b.hallid === parseInt(hallIdFromUrl)
          );

          if (matchingBooking) {
            setSelectedBooking(matchingBooking);
            console.log("✅ Auto-selected booking from URL:", matchingBooking);

            setTimeout(() => {
              if (bookingRefs.current[matchingBooking.id]) {
                bookingRefs.current[matchingBooking.id]?.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }
            }, 500);
          } else if (token) {
            setSelectedBooking(bookingsData[0]);
          }
        } else if (bookingsData.length > 0 && token) {
          setSelectedBooking(bookingsData[0]);
        }
      })
      .finally(() => setIsLoadingBookings(false));
  }, [hallIdFromUrl]);

  const handleBookingSelect = (booking: any) => {
    setSelectedBooking(booking);
    setTimeout(() => {
      const element = bookingRefs.current[booking.id];
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }, 100);
  };

  return {
    bookings,
    allBookings,
    selectedBooking,
    isLoadingBookings,
    bookingRefs,
    handleBookingSelect,
  };
}

export function usePerformerBooking() {
  const [bookingPerformer, setBookingPerformer] = useState<number | null>(null);

  const bookPerformer = async (performerId: number, selectedBooking: any) => {
    try {
      setBookingPerformer(performerId);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Захиалга хийхийн тулд эхлээд нэвтэрнэ үү.");
        setBookingPerformer(null);
        return;
      }

      if (!selectedBooking) {
        toast.error("Та эхлээд Event Hall-оос сонголт хийнэ үү.");
        setBookingPerformer(null);
        return;
      }

      const res = await fetch("/api/performer-bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          performerId,
          hallId: selectedBooking.hallid,
          starttime: selectedBooking.starttime,
          bookeddate: selectedBooking.date,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          "Уран бүтээлчийг захиалах хүсэлт явууллаа. Таньд мэдэгдэл ирнэ, Dashboard хэсгээс харна уу!"
        );
      } else {
        toast.error(data.message || "Захиалга амжилтгүй боллоо.");
      }
    } catch (error) {
      console.error("Error booking performer:", error);
      toast.error("Серверийн алдаа.");
    } finally {
      setBookingPerformer(null);
    }
  };

  return { bookingPerformer, bookPerformer };
}
