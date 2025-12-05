"use client";

import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [docsList, setDocsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const loadDocs = async () => {
      try {
        setLoading(true);
        setErrMsg("");

        const currentUser = auth.currentUser;
        if (!currentUser) {
          setErrMsg("Please login to view your dashboard.");
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "pdfs"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDocsList(data);
      } catch (error) {
        console.error(error);
        setErrMsg("Failed to load your documents. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Manage your uploaded PDFs and open them as interactive flipbooks.
            </p>
          </div>

          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all"
          >
            + Upload new PDF
          </Link>
        </div>

        {/* Status messages */}
        {errMsg && (
          <div className="mb-6 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {errMsg}{" "}
            {errMsg.includes("login") && (
              <Link href="/login" className="underline font-semibold">
                Go to login
              </Link>
            )}
          </div>
        )}

        {loading && (
          <div className="mt-10 text-center text-sm text-slate-400">
            Loading your PDFs…
          </div>
        )}

        {/* Empty state */}
        {!loading && docsList.length === 0 && !errMsg && (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-4">
              📄
            </div>
            <h2 className="text-lg font-semibold mb-1">No PDFs uploaded yet</h2>
            <p className="text-xs text-slate-400 mb-4 max-w-sm">
              Start by uploading your first PDF. We&apos;ll turn it into a
              beautiful flipbook you can preview and share.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700 transition-all"
            >
              Upload your first PDF
            </Link>
          </div>
        )}

        {/* PDFs grid */}
        {!loading && docsList.length > 0 && (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {docsList.map((pdf) => (
              <div
                key={pdf.id}
                className="group relative rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-md hover:shadow-xl hover:border-indigo-500/60 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="font-semibold text-sm text-slate-50 line-clamp-2">
                      {pdf.name || "Untitled Document"}
                    </h2>
                    {pdf.description && (
                      <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                        {pdf.description}
                      </p>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-md bg-indigo-600/90 flex items-center justify-center text-[10px] font-semibold text-white">
                    PDF
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                  {pdf.createdAt && pdf.createdAt.toDate ? (
                    <span>
                      Created:{" "}
                      {pdf.createdAt.toDate().toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  ) : (
                    <span>Created: —</span>
                  )}
                  {pdf.pages && <span>{pdf.pages} pages</span>}
                </div>

                <Link
                  href={`/flipbook/${pdf.id}`}
                  className="inline-flex items-center text-[12px] font-medium text-indigo-400 hover:text-indigo-300"
                >
                  Open Flipbook →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
