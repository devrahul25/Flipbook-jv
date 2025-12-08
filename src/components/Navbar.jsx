"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);

      if (u?.email) {
        setInitials(generateInitials(u.email));
      } else {
        setInitials("");
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  
  function generateInitials(email) {
    const clean = email.split("@")[0]; 
    const parts = clean.split(/[\.\_\-]/); 

    if (parts.length === 1) {
      return parts[0][0]?.toUpperCase(); 
    } else {
      return (parts[0][0] + parts[1][0]).toUpperCase(); 
    }
  }

  return (
    <nav className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-6 md:px-10 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
          F
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          MyFlipbook
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="hidden md:inline text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="hidden md:inline text-sm text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          Dashboard
        </Link>

        {/* If NOT logged in → Show Login + Get Started */}
        {!user && (
          <>
            <Link
              href="/login"
              className="text-sm text-gray-700 dark:text-gray-200 hover:underline"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-all"
            >
              Get Started
            </Link>
          </>
        )}

        {/* If logged in → show avatar */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 flex items-center justify-center bg-indigo-600 text-white rounded-full font-semibold text-sm">
              {initials}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-700 dark:text-gray-200 hover:underline"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
