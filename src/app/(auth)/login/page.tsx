"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/features/auth/authApi";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("12345678");
  const [errorMessage, setErrorMessage] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    try {
      await login({ email: email.trim(), password }).unwrap();
      toast.success("Login successful");
      router.push("/editor");
      router.refresh();
    } catch (err: any) {
      console.error("Login failed:", err);
      const msg = err?.data?.error || "ইমেইল বা পাসওয়ার্ড ভুল (Invalid email or password)";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="bg-[var(--bar)] text-[var(--fg)] p-6 rounded-xl flex flex-col gap-3 w-full max-w-[320px] shadow-2xl border border-gray-400/30">
        <h3 className="text-lg font-bold m-0 text-center">Login</h3>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium mb-1 opacity-80">Email</label>
            <input
              type="email"
              className="w-full p-2 text-sm border border-gray-400/60 rounded-md bg-transparent"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 opacity-80">Password</label>
            <input
              type="password"
              className="w-full p-2 text-sm border border-gray-400/60 rounded-md bg-transparent"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className="text-red-500 text-xs font-medium">{errorMessage}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-[11px] opacity-70 text-center mt-1">
          Default Admin: <b>admin@gmail.com</b> / <b>12345678</b>
          <br />
          (Secured with JWT HttpOnly Cookie &amp; MongoDB Atlas)
        </div>
      </div>
    </div>
  );
}
