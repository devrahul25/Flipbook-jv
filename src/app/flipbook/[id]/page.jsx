"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HTMLFlipBook from "react-pageflip";


import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// --- LOCAL STORAGE ---
import localforage from "localforage";
import Navbar from "@/components/Navbar";

// --- FIREBASE (COMMENTED) ---
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@/lib/firebase";

export default function FlipbookPage() {
  const { id } = useParams();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const loadPDF = async () => {
      // Load local PDF
      const file = await localforage.getItem(id);
      if (!file) return;

      const pdf = await pdfjsLib.getDocument({
        data: await file.arrayBuffer(),
      }).promise;

      const imgs = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        imgs.push(canvas.toDataURL());
      }

      setPages(imgs);
    };

    loadPDF();
  }, [id]);

  if (!pages.length) return <p className="p-10">Loading flipbook...</p>;

  return (
    <>
    <Navbar/>
      <div className="flex justify-center p-10 bg-zinc-400 min-h-screen">
        <HTMLFlipBook width={400} height={600}>
          {pages.map((src, i) => (
            <div key={i}>
              <img src={src} className="w-full h-full object-cover" />
            </div>
          ))}
        </HTMLFlipBook>
      </div>
    </>
  );
}
