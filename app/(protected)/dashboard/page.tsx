"use client";
import Dashboard from "@/components/event-halls/turshih";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/us/Header";
import { useEffect, useState } from "react";

export default function BookingPage() {
  return (
    <div className="p-6">
      <Header />
      <h1 className="text-2xl font-bold mb-5">Таны захиалсан Event hall</h1>
      <Dashboard />
    </div>
  );
}
