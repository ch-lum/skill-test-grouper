"use client";

import { useParams, useRouter } from "next/navigation";
import { useCategories } from "@/context/CategoriesContext";
import { useState, useEffect } from "react";
import CodeBlock from "@/app/ui/CodeBlock";
// import "@/globals.css"

export default function ReviewPage() {
  const { questionData, categories, setCategories } = useCategories();
  const params = useParams();
  const router = useRouter();
  const question = params.question as string;

  // Category data below //
  const categorySlug = params.category as string;
  const currentCategoryIndex = categories.findIndex((cat) => cat.slug === categorySlug);

  const emails = categories.find((cat) => cat.slug === categorySlug)?.email;
  if (!emails) {
    return <div>Category not found</div>;
  }

  // Enforce type safety
  const questionEntries = questionData?.[question] || {};
  if (typeof questionEntries !== 'object') {
    return <div>Invalid question data</div>;
  }

  // Get the code snippets for the emails in emails
  const codeSnippets = emails.map(email => questionEntries[email]).filter(Boolean);
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);

  const highlightLines = categories.find((cat) => cat.slug === categorySlug)?.error_lines || {};

  // Adjust points just in case
  const defaultDeduction = categories.find((cat) => cat.slug === categorySlug)?.default_deduction || -1;
  const [pointDeduction, setPointDeduction] = useState<number>(defaultDeduction);

  // Colors for backgrounds
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-blue-500", "bg-purple-500"];
  const codeBGColor = colors[currentCategoryIndex % colors.length];

  // Handlers
  const handlePointDeductionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPointDeduction(Number(event.target.value));
  };

  const handleNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsFading(false);
      setCurrentSnippetIndex(currentSnippetIndex + 1);
    }, 200);
    
    if (currentSnippetIndex >= codeSnippets.length - 1) {
      // Find next category
      const nextCategorySlug = categories[currentCategoryIndex + 1]?.slug;
      if (nextCategorySlug) {
        router.push(`/questions/${question}/review/${nextCategorySlug}`);
        setCurrentSnippetIndex(0);
      } else {
        // No more categories
        router.push(`/questions/`);
      }
    }
  }

  const handleYes = () => {
    // Send the data to the backend
    handleNext();
  }

  const handleNo = () => {
    // Send the data to the backend
    const currentEmail = emails[currentSnippetIndex];
    const updatedCategories = categories.map((cat) => {
      if (cat.slug === "miscellaneous") {
        return {
          ...cat,
          email: [...cat.email, currentEmail],
        };
      }
      return cat;
    });
    setCategories(updatedCategories);

    handleNext();
  }

  return (
    <div>
      <div className="relative mb-8">
        <div className="absolute top-0 right-0 bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-bl-lg z-10">
          {currentSnippetIndex + 1} / {codeSnippets.length}
        </div>
        <div className={`code-snippet ${codeBGColor} p-4 rounded-lg mb-8 relative z-0`}>
          <CodeBlock
            code={codeSnippets[currentSnippetIndex]} 
            language="python" 
            highlightLines={categorySlug !== "miscellaneous" ? highlightLines[emails[currentSnippetIndex]] || [] : []}
          />
        </div>
      </div>
      {categorySlug !== "miscellaneous" ? (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Is this classified correctly?</h2>
          <div className="flex items-center space-x-4">
            <button onClick={handleNo} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
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
      ) : (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Review miscellaneous</h2>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Enter comment here" // Do we want this? 
              className="border border-gray-300 rounded py-2 px-4 w-1/2"
            />
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
            <button onClick={handleNext} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              {currentSnippetIndex >= codeSnippets.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}