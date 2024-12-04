"use client";

import { useEffect, useState } from "react";
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

const HelperModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full relative z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
          Close
        </button>
        <h2 className="text-2xl font-semibold mb-4">Helper</h2>
        <p className="text-lg">
          This is a helper modal. You can put your README or any other helpful content here.
        </p>
      </div>
      <button
        onClick={onClose}
        className="absolute inset-0 w-full h-full bg-transparent z-0"
        aria-label="Close"
      />
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      router.push("/");
    }
  }, [router]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CategoriesProvider>
          {children}
        </CategoriesProvider>
        <HelperModal isOpen={isModalOpen} onClose={handleCloseModal} />
        <button
          onClick={handleOpenModal}
          className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg font-bold text-xl z-50"
          aria-label="Open Helper"
        >
          ?
        </button>
      </body>
    </html>
  );
}
