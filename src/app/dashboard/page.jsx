"use client";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [docsList, setDocsList] = useState([]);

  useEffect(() => {
    const loadDocs = async () => {
      const q = query(
        collection(db, "pdfs"),
        where("userId", "==", auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      setDocsList(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    loadDocs();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Your PDFs</h1>

      <Link
        href="/upload"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Upload PDF
      </Link>

      <div className="mt-6 space-y-4">
        {docsList.map((pdf) => (
          <div key={pdf.id} className="p-4 border rounded-md bg-white">
            <h2 className="font-semibold">{pdf.name}</h2>
            <Link
              href={`/flipbook/${pdf.id}`}
              className="text-blue-600 underline mt-2 inline-block"
            >
              Open Flipbook →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
