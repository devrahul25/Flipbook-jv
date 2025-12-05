"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} MyFlipbook. All rights reserved.
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <Link href="/privacy" className="hover:text-indigo-500">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-indigo-500">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-indigo-500">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
