"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist/webpack";

export default function FlipbookPage() {
  const { id } = useParams();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchPDF = async () => {
      const snap = await getDoc(doc(db, "pdfs", id));
      const pdfURL = snap.data().pdfURL;

      const pdf = await pdfjsLib.getDocument(pdfURL).promise;
      const imgs = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: ctx,
          viewport,
        }).promise;

        imgs.push(canvas.toDataURL());
      }

      setPages(imgs);
    };

    if (id) fetchPDF();
  }, [id]);

  if (!pages.length) return <p className="p-10">Loading flipbook...</p>;

  return (
    <div className="flex justify-center p-10 bg-gray-100 min-h-screen">
      <HTMLFlipBook width={400} height={600}>
        {pages.map((src, i) => (
          <div key={i}>
            <img src={src} className="w-full h-full object-cover" />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}
