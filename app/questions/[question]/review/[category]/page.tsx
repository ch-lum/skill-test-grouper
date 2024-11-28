"use client";

import { useParams, useRouter } from "next/navigation";
import { useCategories } from "@/context/CategoriesContext";
import { useState } from "react";
import CodeBlock from "@/app/ui/CodeBlock";

export default function ReviewPage() {
  const { questionData, categories } = useCategories();
  const params = useParams();
  const router = useRouter();
  const question = params.question as string;

  // Category data below //
  const categorySlug = params.category as string;

  const emails = categories.find((cat) => cat.slug === categorySlug)?.email;
  if (!emails) {
    return <div>Category not found</div>;
  }

  const categoryTitle = categories.find((cat) => cat.slug === categorySlug)?.title;

  // Enforce type safety
  const questionEntries = questionData?.[question] || {};
  if (typeof questionEntries !== 'object') {
    return <div>Invalid question data</div>;
  }

  // Get the code snippets for the emails in emails
  const codeSnippets = emails.map(email => questionEntries[email]).filter(Boolean);
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState<number>(0);
  
  // Adjust points just in case
  const defaultDeduction = categories.find((cat) => cat.slug === categorySlug)?.default_deduction || -1;
  const [pointDeduction, setPointDeduction] = useState<number>(defaultDeduction);


  // Handlers
  const handlePointDeductionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPointDeduction(Number(event.target.value));
  };

  const handleNext = () => {
    setPointDeduction(defaultDeduction);

    // Navigate to the next code snippet
    if (currentSnippetIndex < codeSnippets.length - 1) {
      setCurrentSnippetIndex(currentSnippetIndex + 1);
    } else {
      // Handle the case when there are no more snippets
      console.log("No more snippets");
      // Find next category
      const currentCategoryIndex = categories.findIndex((cat) => cat.slug === categorySlug);
      const nextCategorySlug = categories[currentCategoryIndex + 1]?.slug;
      if (nextCategorySlug) {
        router.push(`/questions/${question}/review/${nextCategorySlug}`);
      } else {
        // No more categories
        console.log("No more categories");
      }
    }
  }

  const handleYes = () => {
    // Send the data to the backend
    handleNext();
  }

  const handleNo = () => {
    // Send the data to the backend
    handleNext();
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Reviewing Category: {categoryTitle}</h1>
      <div className="relative mb-8">
      <div className="absolute top-0 right-0 bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-bl-lg z-10">
          {currentSnippetIndex + 1} / {codeSnippets.length}
        </div>
        <div className="code-snippet bg-violet-900 p-4 rounded-lg mb-8 relative z-0">
          <CodeBlock code={codeSnippets[currentSnippetIndex]} language="python" />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Is this classified correctly?</h2>
        <div className="flex items-center space-x-4">
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            No
          </button>
          <button onClick={handleYes} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Yes
          </button>
          <div className="flex items-center space-x-2">
            <span>Deduction: </span>
            <input
              type="number"
              min={-1}
              step={0.1}
              max={0}
              value={pointDeduction}
              onChange={handlePointDeductionChange}
              className="border border-gray-300 rounded py-2 px-4"
              placeholder="Point Deduction"
            />
          </div>
        </div>
      </div>
    </div>
  );
}