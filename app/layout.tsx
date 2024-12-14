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
          <ul className="list-disc pl-5">
            <li>In order to upload your data you will need to zip a file named grades.csv and a folder named submissions.</li>
            <li>Once you click upload the data will be processed and you will be redirected to the questions page.</li>
            <li>Note, that if you reload any page you will lose all progress.</li>
            <li>You can click on each question to begin looking through the categories.</li>
            <li>If the categories do not satisfy your needs you can click regenerate to create new categories.</li>
            <li>You can also click on the example to see an example of code that fell into the category.</li>
            <li>If you are satisfied with the categories you can click review button.</li>
            <li>If you click &quot;Yes&quot; it will automatically apply the deductions to the student&apos;s grade.</li>
            <li>If you click &quot;No&quot; the question will be automatically sent into the miscellaneous category.</li>
            <li>Once you have reviewed all categories you will be able to review the miscellaneous category and add your own comments and deductions.</li>
            <li>Then, you can move on to the next question, but keep in mind you cannot go back to this one.</li>
            <li>Once you are done with all of the questions you can click Finish and you will be taken to a page where you can download the csv of the student results.</li>
          </ul>
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
