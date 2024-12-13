"use client";

import { useCategories } from "@/context/CategoriesContext";
import CsvDisplay from "@/app/ui/CsvDisplay";
import Papa from "papaparse";
import { useState } from "react";

export default function DownloadPage() {
  const { csvData } = useCategories();
  const [csvUrl, setCsvUrl] = useState<string>("");

  const handleDownload = () => {
    if (csvData.length === 0) {
      alert("No data available to download");
      return;
    }

    // Convert CSV data to a CSV string
    const csvString = Papa.unparse(csvData);

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    // Generate a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Set the URL in state
    setCsvUrl(url);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Download CSV</h1>
      <button
        onClick={handleDownload}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
      >
        Prepare Download
      </button>
      {csvUrl && (
        <a
          href={csvUrl}
          download="results.csv"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
          onClick={() => {
            // Revoke the object URL after the download
            setTimeout(() => URL.revokeObjectURL(csvUrl), 1000);
            setCsvUrl("");
          }}
        >
          Download CSV
        </a>
      )}
      <div className="mt-8">
        <CsvDisplay data={csvData} />
      </div>
    </div>
  );
}