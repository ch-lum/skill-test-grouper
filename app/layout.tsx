"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CategoriesProvider } from "@/context/CategoriesContext";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to exit the page? You might lose progress.";
      localStorage.removeItem("disabledButtons");
      localStorage.setItem("redirectToQuestions", "true");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    const redirectToQuestions = localStorage.getItem("redirectToQuestions");
    if (redirectToQuestions === "true") {
      localStorage.removeItem("redirectToQuestions");
      // router.push("/questions");
    }
  }, [router]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CategoriesProvider>
          {children}
        </CategoriesProvider>
      </body>
    </html>
  );
}
