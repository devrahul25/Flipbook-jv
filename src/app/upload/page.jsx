"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF");

    const fileRef = ref(storage, `pdfs/${Date.now()}-${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    // ✅ Save PDF URL in Firestore
    const docRef = doc(db, "pdfs", Date.now().toString());
    await setDoc(docRef, { pdfURL: downloadURL });

    // ✅ Redirect to flipbook page
    router.push(`/flipbook/${docRef.id}`);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Upload New PDF</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleUpload}
        className="ml-4 bg-green-600 text-white px-5 py-2 rounded cursor-pointer"
      >
        Upload
      </button>
    </div>
  );
}
