"use client";
import { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjs from "pdfjs-dist/webpack";

export default function FlipbookViewer({ pdfURL }) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const pdf = await await pdfjs.getDocument(pdfURL).promise;
      const imgs = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        imgs.push(canvas.toDataURL());
      }
      setPages(imgs);
    };
    load();
  }, [pdfURL]);

  if (!pages.length) {
    return (
      <div className="flex items-center justify-center h-full">Loading ...</div>
    );
  }

  return (
    <div className="flex justify-center w-full px-4 py-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <HTMLFlipBook width={600} height={800} className="shadow-lg">
        {pages.map((src, idx) => (
          <div key={idx} className="bg-white dark:bg-black">
            <img src={src} className="block w-full" />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}


