"use client";
import React, { useState, useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  view: "login" | "signup";
  onViewChange: (view: "login" | "signup") => void;
}

export const AuthForm = ({ view, onViewChange }: AuthFormProps) => {
  const isLoginView = view === "login";

  // ✅ State for all input fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Password validation on sign-up
    if (!isLoginView) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "Password must be at least 8 characters long and contain an uppercase letter, a number, and a special character."
        );
        return; // Stop the submission if validation fails
      }
    }

    startTransition(async () => {
      const url = isLoginView ? "/api/logIn" : "/api/signUp";
      const body = isLoginView
        ? { email, password }
        : { name, phone, email, password };

      try {
        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const data = await result.json();

        if (!result.ok) {
          setError(data.error || "An unexpected error occurred.");
          return;
        }

        // Success! Store token and reload to update header.
        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.reload();
        }
      } catch (e) {
        setError(`Failed to connect to the server.${e}`);
      }
    });
  };

  return (
    <div className=" w-96 rounded-2xl shadow-lg overflow-hidden bg-transparent">
      <div className="p-8 text-white">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {isLoginView ? "Welcome Back" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="bg-red-500/30 text-red-200 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          {!isLoginView && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4
             bg-black/20 text-white placeholder:text-gray-300 leading-tight
             focus:outline-none focus:shadow-outline"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your Phone Number"
                  className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4
             bg-black/20 text-white placeholder:text-gray-300 leading-tight
             focus:outline-none focus:shadow-outline"
                  required
                  disabled={isPending}
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              {isLoginView ? "Email or Phone Number" : "Email"}
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4
             bg-black/20 text-white placeholder:text-gray-300 leading-tight
             focus:outline-none focus:shadow-outline"
              required
              disabled={isPending}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="shadow appearance-none border border-white/20 rounded w-full py-3 px-4
             bg-black/20 text-white placeholder:text-gray-300 leading-tight
             focus:outline-none focus:shadow-outline"
                required
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isPending}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {isPending ? "Logging..." : isLoginView ? "Log In" : "Sign Up"}
          </button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm">
            {isLoginView
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => onViewChange(isLoginView ? "signup" : "login")}
              disabled={isPending}
              className="font-bold text-blue-400 hover:text-blue-300 bg-transparent border-none"
            >
              {isLoginView ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
