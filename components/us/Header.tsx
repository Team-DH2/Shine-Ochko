"use client";
import React, { useState, useEffect } from "react";
import { ButtonOfNav } from "./ButtonOfNav";

import {
  Building,
  Home,
  LayoutDashboard,
  Music,
  Search,
  Users,
  X,
} from "lucide-react";

import { BottomNavButton } from "./BottomNavButton";
import { AuthForm } from "./AuthForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Logo } from "./Logo";
import SearchFunction from "./Searchbar";

export const Header = () => {
  const [isPhoneSearchOpen, setIsPhoneSearchOpen] = useState(false);
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const styleDesktop =
    "pl-10 h-10 rounded-[20px] bg-neutral-800 border-none w-full text-sm";
  const styleMobile =
    "w-full pl-10 h-9 rounded-[20px] bg-neutral-800 border-none text-white text-sm justify-center ";

  useEffect(() => {
    Promise.resolve().then(() => setHasMounted(true));
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    Promise.resolve().then(() => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(Boolean(token));
    });
  }, [hasMounted]);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (!hasMounted) return null;

  return (
    <>
      {/* DESKTOP HEADER */}
      <div className="hidden lg:flex text-white w-full h-20 items-center justify-between bg-black/50 backdrop-blur-sm px-10">
        <div className="flex-1 flex justify-start">
          <Logo />
        </div>

        <div className="flex items-center gap-4 font-bold">
          <ButtonOfNav href="/home" text="Home" />
          <ButtonOfNav href="/event-halls" text="Event Halls" />
          <ButtonOfNav href="/performers" text="Performers" />
          <ButtonOfNav href="/hosts" text="Hosts" />
          <ButtonOfNav href="/dashboard" text="Dashboard" />
          <ButtonOfNav href="/eventhall-form" text="Event Hall Form" />
          <ButtonOfNav href="/profile" text="Profile" />
          <ButtonOfNav href="/adminpanel" text="Admin Panel" />
        </div>

        <div className="flex-1 flex justify-end items-center gap-3">
          <div className="flex items-center w-full max-w-[220px]">
            <Search className="mr-[-36] w-5 z-10 text-neutral-500" />
            <SearchFunction styleDesktop={styleDesktop} />
          </div>

          {isLoggedIn ? (
            <button
              onClick={handleLogoutClick}
              className="bg-blue-600 rounded-md px-4 h-10 text-sm"
            >
              LogOut
            </button>
          ) : (
            <div className="flex items-center gap-2 ">
              <button
                onClick={() => {
                  setAuthView("login");
                  setIsAuthModalOpen(true);
                }}
                className="bg-transparent rounded-md h-10 px-4 text-sm font-semibold"
              >
                LogIn
              </button>
              <button
                onClick={() => {
                  setAuthView("signup");
                  setIsAuthModalOpen(true);
                }}
                className="bg-blue-600 rounded-md px-4 h-10 text-sm font-semibold"
              >
                SignUp
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 flex lg:hidden h-16 w-full items-center bg-black/50 px-4 text-white backdrop-blur-sm">
        {!isPhoneSearchOpen ? (
          <Logo />
        ) : (
          <div
            onClick={() => setIsPhoneSearchOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 hover:bg-neutral-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </div>
        )}

        <div className="flex-1 mx-4">
          {isPhoneSearchOpen && (
            <div className="flex items-center justify-center">
              <Search className="mr-[-36] w-5 z-10 text-neutral-500" />
              <SearchFunction styleDesktop={styleMobile} />
            </div>
          )}
        </div>

        {!isPhoneSearchOpen ? (
          <div className="flex items-center gap-3">
            <Search
              className="w-6 h-6 text-neutral-300 hover:text-white"
              onClick={() => setIsPhoneSearchOpen(true)}
            />
            {isLoggedIn ? (
              <button
                onClick={handleLogoutClick}
                className="bg-blue-600 hover:bg-blue-700 rounded-md px-3 h-9 text-xs"
              >
                LogOut
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around bg-black/50 backdrop-blur-sm lg:hidden">
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

      {/* AUTH MODAL (NO STRUCTURE BREAKING) */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md w-fit data-[state=open]:bg-black/60 data-[state=open]:backdrop-blur-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {authView === "login" ? "Log In" : "Sign Up"}
            </DialogTitle>
          </DialogHeader>
          <AuthForm view={authView} onViewChange={setAuthView} />
        </DialogContent>
      </Dialog>

      {/* LOGOUT MODAL (FIXED) */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md data-[state=open]:bg-black/60 data-[state=open]:backdrop-blur-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>Confirm Log Out</DialogTitle>
          </DialogHeader>

          <div className="w-full rounded-2xl shadow-lg overflow-hidden bg-black/80">
            <div className="p-8 text-white">
              <h2 className="text-2xl font-bold mb-4 text-center">Log Out</h2>
              <p className="text-center text-neutral-400 mb-8">
                Are you sure you want to log out?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3 px-4 rounded-lg w-full"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmLogout}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg w-full"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
