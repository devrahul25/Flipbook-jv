"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [docsList, setDocsList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // "home" | "active" | "archived" | "analytics" | "settings"

  // Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // Load PDFs
  useEffect(() => {
    const loadDocs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const q = query(
          collection(db, "pdfs"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDocsList(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadDocs();
  }, [user]);

  // Derived lists
  const activeDocs = useMemo(
    () => docsList.filter((pdf) => !pdf.archived),
    [docsList]
  );
  const archivedDocs = useMemo(
    () => docsList.filter((pdf) => pdf.archived),
    [docsList]
  );

  // Search filter (only for flipbook lists)
  const filteredActiveDocs = useMemo(() => {
    if (!search.trim()) return activeDocs;
    const term = search.toLowerCase();
    return activeDocs.filter((pdf) =>
      (pdf.name || "Untitled").toLowerCase().includes(term)
    );
  }, [activeDocs, search]);

  const filteredArchivedDocs = useMemo(() => {
    if (!search.trim()) return archivedDocs;
    const term = search.toLowerCase();
    return archivedDocs.filter((pdf) =>
      (pdf.name || "Untitled").toLowerCase().includes(term)
    );
  }, [archivedDocs, search]);

  const headerTitleMap = {
    home: "Overview",
    active: "Active Flipbooks",
    archived: "Archived Flipbooks",
    analytics: "Analytics",
    settings: "Settings",
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="flex h-screen">
        {/* SIDEBAR */}
        <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
          <div className="h-14 flex items-center px-5 border-b border-gray-200">
            <span className="text-sm font-semibold text-gray-900">
              Dashboard
            </span>
          </div>

          <nav className="flex-1 py-4 text-sm text-gray-600">
            <Link href="/" className="block">
              <SidebarItem
                label="Home"
                active={false} // Home is not a dashboard tab
                onClick={() => {}} // No local tab switching
              />
            </Link>
            <SidebarItem
              label="Active Flipbooks"
              active={activeTab === "active"}
              onClick={() => setActiveTab("active")}
            />
            <SidebarItem
              label="Archived Flipbooks"
              active={activeTab === "archived"}
              onClick={() => setActiveTab("archived")}
            />
            <SidebarItem
              label="Analytics"
              active={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
            />
            <SidebarItem
              label="Settings"
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </nav>

          <div className="px-5 py-4 text-[11px] text-gray-400 border-t border-gray-200">
            Tip: Upload a PDF to generate an interactive flipbook.
          </div>
        </aside>

        {/* MAIN AREA */}
        <div className="flex-1 flex flex-col">
          {/* TOP BAR */}
          <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div className="text-sm font-medium text-gray-900">
              {headerTitleMap[activeTab]}
            </div>
            <div className="text-xs text-gray-600">
              {user?.email || "Not logged in"}
            </div>
          </header>

          {/* CONTENT */}
          <main className="flex-1 px-6 py-5 overflow-auto">
            {/* Top row only for flipbook tabs */}
            {(activeTab === "active" || activeTab === "archived") && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder={`Search ${
                      activeTab === "active" ? "active" : "archived"
                    } flipbooks...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500"
                  />
                </div>

                <Link
                  href="/upload"
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  + Upload New PDF
                </Link>
              </div>
            )}

            {/* TAB CONTENT */}
            {activeTab === "home" && (
              <HomeTab docsList={docsList} loading={loading} />
            )}

            {activeTab === "active" && (
              <FlipbookTable
                title="Active Flipbooks"
                loading={loading}
                docs={filteredActiveDocs}
                emptyMessage={
                  docsList.length === 0
                    ? "No PDFs uploaded yet. Click “Upload New PDF” to get started."
                    : "No active flipbooks match your search."
                }
              />
            )}

            {activeTab === "archived" && (
              <FlipbookTable
                title="Archived Flipbooks"
                loading={loading}
                docs={filteredArchivedDocs}
                emptyMessage={
                  archivedDocs.length === 0
                    ? "No archived flipbooks yet."
                    : "No archived flipbooks match your search."
                }
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsTab docsList={docsList} loading={loading} />
            )}

            {activeTab === "settings" && <SettingsTab />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---- Components ---- */

function SidebarItem({ label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm ${
        active
          ? "bg-[#eef3ff] text-indigo-700 font-medium border-r-4 border-indigo-500"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
      {label}
    </button>
  );
}

// Overview card-style home tab
function HomeTab({ docsList, loading }) {
  const total = docsList.length;
  const archived = docsList.filter((d) => d.archived).length;
  const active = total - archived;

  return (
    <div className="space-y-5">
      <h2 className="text-base font-semibold text-gray-900">
        Welcome to your flipbook dashboard
      </h2>

      {loading ? (
        <p className="text-xs text-gray-500">Loading stats…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Flipbooks" value={total} />
          <StatCard label="Active" value={active} />
          <StatCard label="Archived" value={archived} />
        </div>
      )}

      <p className="text-xs text-gray-500">
        Use the sidebar to switch between Active Flipbooks, Archived items and
        basic analytics.
      </p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function FlipbookTable({ title, loading, docs, emptyMessage }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200 text-[11px] uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Pages</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-xs text-gray-500"
                >
                  Loading flipbooks…
                </td>
              </tr>
            )}

            {!loading && docs.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-xs text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {!loading &&
              docs.map((pdf) => (
                <tr
                  key={pdf.id}
                  className="border-t border-gray-100 hover:bg-gray-50/60 transition"
                >
                  <td className="px-4 py-3 text-xs font-medium text-gray-900">
                    {pdf.name || "Untitled"}
                  </td>
                  <td className="px-4 py-3 text-xs">{pdf.pages || "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    {pdf.createdAt && pdf.createdAt.toDate
                      ? pdf.createdAt.toDate().toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/flipbook/${pdf.id}`}
                        className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100"
                      >
                        View
                      </Link>
                      <Link
                        href={`/upload?edit=${pdf.id}`}
                        className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 border border-yellow-100 hover:bg-yellow-100"
                      >
                        Pause
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
                      >
                        Analytics
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsTab({ docsList, loading }) {
  if (loading) {
    return <p className="text-xs text-gray-500">Loading analytics…</p>;
  }

  const total = docsList.length;
  const archived = docsList.filter((d) => d.archived).length;
  const active = total - archived;

  return (
    <div className="space-y-5">
      <h2 className="text-base font-semibold text-gray-900">
        Basic Analytics (placeholder)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Flipbooks" value={total} />
        <StatCard label="Active Flipbooks" value={active} />
        <StatCard label="Archived Flipbooks" value={archived} />
      </div>
      <p className="text-xs text-gray-500">
        Later you can add more detailed graphs like views, time spent, etc.
      </p>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold text-gray-900">Settings</h2>
      <p className="text-xs text-gray-500">
        Placeholder for future settings (theme, account, notifications, etc.).
      </p>
    </div>
  );
}
