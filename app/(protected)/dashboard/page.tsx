"use client";
import Dashboard from "@/components/event-halls/Dashboard";

import { Header } from "@/components/us/Header";

export default function BookingPage() {
  return (
    <div className="p-6">
      <Header />
      <h1 className="text-2xl font-bold mb-5">Таны захиалсан Event hall</h1>
      <Dashboard />
    </div>
  );
}
