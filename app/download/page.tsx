"use client"

import { useCategories } from "@/context/CategoriesContext";
import Papa from "papaparse";
import CsvDisplay from "@/app/ui/CsvDisplay";

export default function DownloadPage() {
  const { questionData, csvData } = useCategories();

  // if (csvData.length > 0) {
  //   const csvString = Papa.unparse(csvData);
  //   console.log(csvString);
  // }

  console.log(questionData);
  console.log
  return (
    <div className="container mx-auto p-8">
      <p>Test: </p>
      <CsvDisplay data={csvData} />
    </div>
  );
}