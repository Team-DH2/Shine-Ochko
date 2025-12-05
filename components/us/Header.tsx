"use client";
import { useState } from "react";
import { ButtonOfNav } from "./ButtonOfNav";
import { Input } from "../ui/input";
import {
  Search,
  X,
  Home,
  Building,
  Music,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { Logo } from "./Logo";
import { BottomNavButton } from "./BottomNavButton";
import { AuthForm } from "./AuthForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogOverlay } from "@radix-ui/react-dialog";
import SearchFunction from "./Search";

export const Header = () => {
  const [isPhoneSearchOpen, setIsPhoneSearchOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      {/* ---------------- DESKTOP HEADER ---------------- */}
      <div className="hidden lg:flex text-white w-full h-20 items-center justify-between bg-black/50 backdrop-blur-sm px-10">
        {/* Left Side */}
        <div className="flex-1 flex justify-start">
          <Logo />
        </div>

        {/* Centered Navigation */}
        <div className="flex items-center gap-4 font-bold">
          <ButtonOfNav href="/home" text="Home" />
          <ButtonOfNav href="/event-halls" text="Event Halls" />
          <ButtonOfNav
            href="/performers/dashboard-to-performers"
            text="Performers"
          />
          <ButtonOfNav href="/host" text="Hosts" />
          <ButtonOfNav href="/dashboard" text="Dashboard" />
          <ButtonOfNav href="/contact" text="Event Hall Form" />
          <ButtonOfNav href="/profile" text="Profile" />
        </div>

        {/* Right Side */}
        <div className="flex-1 flex justify-end items-center gap-3">
          <div className="flex items-center w-full max-w-[220px]">
            {/* <Search className="mr-[-36] w-5 z-10 text-neutral-500" /> */}
            <SearchFunction></SearchFunction>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAuthView("login");
                setIsAuthModalOpen(true);
              }}
              className="bg-transparent rounded-md h-10 px-4 text-sm"
            >
              LogIn
            </button>
            <button
              onClick={() => {
                setAuthView("signup");
                setIsAuthModalOpen(true);
              }}
              className="bg-blue-600 rounded-md px-4 h-10 text-sm"
            >
              SignUp
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- MOBILE/TABLET HEADER ---------------- */}
      <div className="fixed top-0 left-0 right-0 z-50 flex lg:hidden h-16 w-full items-center bg-black/50 px-4 text-white backdrop-blur-sm">
        {/* LEFT SIDE: Logo OR X Button */}
        {!isPhoneSearchOpen ? (
          <Logo />
        ) : (
          <X
            className="w-6 h-6 text-neutral-300 hover:text-white mr-3"
            onClick={() => setIsPhoneSearchOpen(false)}
          />
        )}

        {/* MIDDLE: Search input (full width when open) */}
        <div className="flex-1 mx-4">
          {isPhoneSearchOpen && (
            <div className="flex items-center">
              <Search className="mr-[-36] w-5 z-10 text-neutral-500" />
              <Input
                placeholder="Search..."
                className="w-full pl-10 h-9 rounded-[20px] bg-neutral-800 border-none text-white text-sm"
              />
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Search button + Auth (hidden when searching) */}
        {!isPhoneSearchOpen ? (
          <div className="flex items-center gap-3">
            <Search
              className="w-6 h-6 text-neutral-300 hover:text-white"
              onClick={() => setIsPhoneSearchOpen(true)}
            />
            <button
              onClick={() => {
                setAuthView("login");
                setIsAuthModalOpen(true);
              }}
              className="bg-transparent rounded-md h-9 px-3 text-xs"
            >
              LogIn
            </button>
            <button
              onClick={() => {
                setAuthView("signup");
                setIsAuthModalOpen(true);
              }}
              className="bg-blue-600 rounded-md px-3 h-9 text-xs"
            >
              SignUp
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* ---------------- MOBILE/TABLET BOTTOM NAV ---------------- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around  bg-black/50 backdrop-blur-sm lg:hidden">
        <BottomNavButton
          href="/home"
          label="Home"
          icon={<Home className="w-5 h-5" />}
        />
        <BottomNavButton
          href="/event-halls"
          label="Halls"
          icon={<Building className="w-5 h-5" />}
        />
        <BottomNavButton
          href="/performers"
          label="Performers"
          icon={<Music className="w-5 h-5" />}
        />
        <BottomNavButton
          href="/hosts"
          label="Hosts"
          icon={<Users className="w-5 h-5" />}
        />
        <BottomNavButton
          href="/dashboard"
          label="Dashboard"
          icon={<LayoutDashboard className="w-5 h-5" />}
        />
      </div>

      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px]">
          <DialogContent className="p-0 border-none bg-transparent w-100 rounded-3xl shadow-none max-w-md data-[state=open]:bg-neutral-900/50 data-[state=open]:backdrop-blur-xs [&>button]:hidden">
            <DialogHeader className="sr-only">
              <DialogTitle>
                {authView === "login" ? "Log In" : "Sign Up"}
              </DialogTitle>
            </DialogHeader>
            <AuthForm view={authView} onViewChange={setAuthView} />
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </>
  );
};
