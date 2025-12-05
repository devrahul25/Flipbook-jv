// "use client";

// import Link from "next/link";
// import Navbar from "@/components/Navbar";

// export default function Home() {
//   return (
//     <>
//     <Navbar/>
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center px-6">
//         <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
//           Create Your Own Flipbook
//         </h1>

//         <p className="text-gray-600 dark:text-gray-300 text-center max-w-xl mb-10">
//           Upload your PDF and instantly transform it into a beautiful,
//           interactive flipbook. Fast, simple, and shareable.
//         </p>

//         <div className="flex gap-4">
//           <Link
//             href="/register"
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
//           >
//             Get Started
//           </Link>

//           <Link
//             href="/login"
//             className="px-6 py-3 border border-gray-400 text-gray-700 dark:text-gray-200 
//                     rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//           >
//             Login
//           </Link>
//         </div>
//       </div>
//     </>
//   );
// }


"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <Navbar />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
