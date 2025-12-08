"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// If you use Firebase Auth:
import { auth } from "@/lib/firebase";
// If local-only mode, no auth → you can later replace this easily

export default function Hero() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for login/logout
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return () => unsub();
  }, []);

  return (
    <section className="w-full bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 text-white py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center gap-10">
        {/* Left: Text */}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300 mb-3">
            Flip Your PDFs into Experiences
          </p>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            Turn static PDFs into
            <span className="text-indigo-400"> interactive flipbooks</span>.
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-xl mb-6">
            Upload, preview and share your documents as beautiful, realistic
            flipbooks. Built for creators, educators and marketers who want
            their content to feel premium.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-indigo-600 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-indigo-600 transition-all"
                >
                  Get Started Free
                </Link>

                <Link
                  href="/login"
                  className="text-sm text-slate-200 hover:text-white underline-offset-4 hover:underline"
                >
                  Already have an account? Login
                </Link>
              </>
            )}
          </div>

          {!user && (
            <p className="mt-4 text-xs text-slate-400">
              No credit card required · Just upload a PDF and see the magic.
            </p>
          )}
        </div>

        {/* Right: Preview */}
        <div className="flex-1 flex justify-center">
          <div className="w-64 md:w-80 h-80 md:h-96 rounded-xl bg-slate-800/80 border border-slate-700 shadow-2xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                PDF
              </div>
              <span className="text-xs text-slate-400">Live Flip Preview</span>
            </div>

            <div className="flex-1 bg-slate-900/70 rounded-lg border border-slate-700 flex items-center justify-center text-xs text-slate-400">
              Flipbook preview area
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span>Pages: 24</span>
              <span>Last edited: Just now</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
