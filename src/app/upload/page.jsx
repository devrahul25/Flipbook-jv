"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// --- LOCAL STORAGE (IndexedDB) ---
import localforage from "localforage";
localforage.config({
  name: "flipbookLocalDB",
  storeName: "pdfStore",
});

// --- FIREBASE (COMMENTED FOR NOW) ---
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { doc, setDoc } from "firebase/firestore";
// import { storage, db } from "@/lib/firebase";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF.");
      return;
    }

    try {
      setLoading(true);

      const id = Date.now().toString();

      // ---------------------------------------------
      // LOCAL STORAGE MODE (ACTIVE)
      // ---------------------------------------------
      await localforage.setItem(id, file);

      localStorage.setItem(
        "pdf-" + id,
        JSON.stringify({
          name: file.name,
          id,
          createdAt: new Date(),
        })
      );

      // ---------------------------------------------
      // FIREBASE MODE (DISABLED FOR NOW)
      // ---------------------------------------------
      /*
      const fileRef = ref(storage, `pdfs/${id}-${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const docRef = doc(db, "pdfs", id);
      await setDoc(docRef, {
        name: file.name,
        pdfURL: downloadURL,
        createdAt: new Date(),
      });
      */

      router.push(`/flipbook/${id}`);
    } catch (error) {
      console.error(error);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.type === "application/pdf") {
        setFile(dropped);
      } else {
        alert("Only PDF files allowed.");
      }
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      alert("Only PDF files allowed.");
      return;
    }
    setFile(selected);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Upload New PDF
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Upload a PDF and convert it into an interactive flipbook.
        </p>

        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
            dragActive
              ? "border-indigo-500 bg-indigo-50/50"
              : "border-gray-300 bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="pdf-upload"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {file ? (
            <div>
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Ready to upload your PDF.
              </p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-4">Drag & drop your PDF here</p>
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer inline-block bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Browse PDF
              </label>
            </>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`mt-6 w-full bg-indigo-600 text-white py-2.5 rounded-md text-sm font-medium shadow-sm transition-all ${
            loading || !file
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-indigo-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload PDF"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          Only PDF files are supported.
        </p>
      </div>
    </div>
  );
}
