"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new manage page
    router.push("/adminpanel/manage");
  }, [router]);

  const getUserBookings = async () => {
    try {
      const res = await fetch(`/api/getforms`);
      const data = await res.json();
      setForm(data.data || []);
    } catch (error) {
      console.error("Error fetching event hall:", error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      getUserBookings();
    }
  }, [isAdmin]);

  const handleActionClick = (id: string, action: "accept" | "decline") => {
    setSelectedRequest({ id, action });
  };

  const handleConfirm = async () => {
    if (!selectedRequest) return;
    setLoadingId(selectedRequest.id);

    try {
      const res = await fetch(`/api/form/form-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedRequest.id }), // <== object болгож дамжуулах
      });

      if (res.ok) {
        setForm((prev) =>
          prev.filter((item) => item.id !== selectedRequest.id)
        );
      } else {
        console.error("API error:", await res.text());
      }
    } catch (error) {
      console.error("Request failed:", error);
    } finally {
      setLoadingId(null);
      setSelectedRequest(null);
    }
  };

  const handleCancel = () => {
    setSelectedRequest(null);
  };

  // Show loading while checking admin status
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!form) return <div>Loading...</div>;
  const openModal = (images: string[], index: number) => {
    setModalState({ images, currentIndex: index });
  };

  const closeModal = () => setModalState(null);

  const prevImage = () => {
    if (!modalState) return;
    setModalState({
      ...modalState,
      currentIndex:
        (modalState.currentIndex - 1 + modalState.images.length) %
        modalState.images.length,
    });
  };

  const nextImage = () => {
    if (!modalState) return;
    setModalState({
      ...modalState,
      currentIndex: (modalState.currentIndex + 1) % modalState.images.length,
    });
  };
  console.log("form", form);
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
