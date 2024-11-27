"use client";

import { useEffect, useState } from "react";
import { generateCategories, Category } from "@/lib/generateCategories";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await generateCategories();
      setCategories(data.categories);
      setLoading(false);
    };

    fetchCategories();
  }, []); // Run once on component mount

  // Possibly use loading.tsx?
  if (loading) {
    return <div>Loading...</div>;
  }

  const aiCategories = categories.filter((category) => !category.default);
  const defaultCategories = categories.filter((category) => category.default);

  // Button logic
  const handleProceed = () => {
    const slug = aiCategories[0].slug;
    if (slug) {
      router.push(`/review/${slug}`);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    const data = await generateCategories();
    setCategories(data.categories);
    setLoading(false);
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Categories Overview</h1>

      {/* AI-generated Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">AI-Generated Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiCategories.map((category, index) => (
            <div key={index} className="category-card bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-4">{category.title}</h3>
              <div className="code-snippet bg-gray-100 p-4 rounded-lg">
                {/* Placeholder for code snippet */}
                <p className="text-sm text-gray-600">Code snippet will go here.</p>
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
              <h3 className="text-xl font-medium mb-4">{category.title}</h3>
              <div className="code-snippet bg-gray-100 p-4 rounded-lg">
                {/* Placeholder for code snippet */}
                <p className="text-sm text-gray-600">Code snippet will go here.</p>
              </div>
            </div>
          ))}
        </div>
      </div>

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