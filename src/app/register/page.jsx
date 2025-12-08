// "use client";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function Register() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const registerUser = async () => {
//     await createUserWithEmailAndPassword(auth, email, password);
//     router.push("/dashboard");
//   };

//   return (
//     <div className="p-10 flex flex-col items-center">
//       <h1 className="text-3xl font-bold">Register</h1>

//       <input
//         type="email"
//         placeholder="Email"
//         className="input mt-4 border p-2 w-80"
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         type="password"
//         placeholder="Password"
//         className="input mt-3 border p-2 w-80"
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <button
//         onClick={registerUser}
//         className="mt-5 bg-green-600 text-white px-5 py-2 rounded-md"
//       >
//         Register
//       </button>
//     </div>
//   );
// }

"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    setErrMsg("");
    setInfoMsg("");

    if (!email || !password) {
      setErrMsg("Please enter both email and password.");
      return;
    }
    if (password.length < 6) {
      setErrMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setInfoMsg("An account with this email already exists.");
      } else {
        setErrMsg(error.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-950 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl border border-slate-800 p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-white mb-2">
          Create your account
        </h1>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-6">
          Start turning your PDFs into beautiful flipbooks in seconds.
        </p>

        {/* Info / error messages */}
        {infoMsg && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {infoMsg}{" "}
            <Link
              href="/login"
              className="font-semibold underline underline-offset-2"
            >
              Login instead
            </Link>
          </div>
        )}

        {errMsg && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errMsg}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

          <button
            onClick={registerUser}
            disabled={loading}
            className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-md shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </div>

        <p className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-indigo-500 hover:text-indigo-400 font-medium"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
