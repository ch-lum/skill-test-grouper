"use client";

import { useEffect, useState } from "react";
import { generateCategories, Category } from "@/lib/generateCategories";
import { useCategories } from "@/context/CategoriesContext";
import { useRouter, useParams } from "next/navigation";
import CodeBlock from "@/app/ui/CodeBlock";

const Modal = ({ isOpen, onClose, codeSnippet, highlight, title }: { isOpen: boolean, onClose: () => void, codeSnippet: string, highlight: number[], title: string}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-900">
            Close
        </button>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <CodeBlock code={codeSnippet} language="python" highlightLines={highlight} />
      </div>
      <button onClick={onClose} className="absolute inset-0 w-full h-full bg-transparent z-0">
        Close
      </button>
    </div>
  );
};

export default function CategoriesPage() {
  const { categories, loading, regenerateCategories, questionData, setCategories } = useCategories();
  const router = useRouter();
  const params = useParams();
  const question = params.question as string;
  const [expandedSnippets, setExpandedSnippets] = useState<string | null>(null);
  const [expandedHighlight, setExpandedHighlight] = useState<number[]>([]);
  const [expandedTitle, setExpandedTitle] = useState<string>("");
  const [deductions, setDeductions] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Possibly use loading.tsx?
  console.log(loading);
  if (loading) {
    return <div>Loading...</div>;
  }

  const aiCategories = categories.filter((category) => !category.default);
  const defaultCategories = categories.filter((category) => category.default);

  const handleSnippetClick = (codeSnippet: string, highlight: number[], title: string) => {
    setExpandedSnippets(codeSnippet);
    setExpandedHighlight(highlight);
    setExpandedTitle(title);
  }

  const handleCloseModal = () => {
    setExpandedSnippets(null);
  }

  const handleDeductionChange = (slug: string, value: number) => {
    setDeductions((prev) => ({
      ...prev,
      [slug]: value,
    }));
  };

  // Button logic
  const handleProceed = () => {
    const updatedCategories = categories.map((category) => {
      if (deductions[category.slug] !== undefined) {
        return {
          ...category,
          default_deduction: deductions[category.slug],
        };
      }
      return category;
    });

    setCategories(updatedCategories);

    const slug = aiCategories[0].slug;
    if (slug) {
      router.push(`review/${slug}`);
    }
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    await regenerateCategories(question, questionData);
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto p-8">
      {/* Loading Overlay */}
      <div className="relative">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="loader"></div>
          </div>
        )}
      </div>
      
      <h1 className="text-3xl font-semibold mb-6">Categories Overview</h1>

      {/* AI-generated Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">AI-Generated Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiCategories.map((category, index) => (
            <div key={index} className="category-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-2">{category.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              <p className="text-sm text-gray-600 mb-2 italic">Count: {category.emails.length}</p>
              <div className="flex items-center mb-2">
                <p className="text-sm text-gray-600 mr-2">Suggested deduction</p>
                <input 
                  type="number" 
                  min={-1}
                  step={0.1}
                  max={0}
                  defaultValue={category.default_deduction}
                  onChange={(e) => handleDeductionChange(category.slug, Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg p-2 w-1/3" 
                />
              </div>
              <div 
                className="code-snippet bg-gray-100 p-4 rounded-lg cursor-pointer"
                onClick={() => handleSnippetClick(
                  questionData![question][category.emails[0]],
                  category.error_lines[category.emails[0]],
                  category.title
                )}
              >
                <p className="text-sm text-gray-600">Click for example</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Default Categories */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Default Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultCategories.map((category, index) => (
            <div key={index} className="category-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-2">{category.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              <p className="text-sm text-gray-600 mb-2 italic">Count: {category.emails.length}</p>
              <div className="flex items-center mb-0">
                <p className="text-sm text-gray-600 mr-2">Suggested deduction</p>
                <input 
                  type="number" 
                  min={-1}
                  step={0.1}
                  max={0}
                  defaultValue={category.default_deduction}
                  onChange={(e) => handleDeductionChange(category.slug, Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded-lg p-2 w-1/3" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={!!expandedSnippets} onClose={handleCloseModal} codeSnippet={expandedSnippets || ""} highlight={expandedHighlight} title={expandedTitle} />

      {/* Buttons */}
      <div className="mt-8">
        {/* Regenerate */}
        <button
          onClick={handleRegenerate}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-4"
        >
          Regenerate Categories
        </button>
        {/* Proceed */}
        <button
          onClick={handleProceed}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Proceed to Review
        </button>
      </div>
    </div>
  );
}