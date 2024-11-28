"use client"

import { useCategories } from "@/context/CategoriesContext";

export default function DownloadPage() {
  const { questionData } = useCategories();
  console.log(questionData);
  return (
    <div>
      <p>Test: </p>
    </div>
  );
}