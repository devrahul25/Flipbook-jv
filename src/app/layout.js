import "./globals.css";

export const metadata = {
  title: "Flipbook SaaS",
  description: "Upload and convert PDFs into flipbooks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
