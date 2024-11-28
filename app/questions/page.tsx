"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/context/CategoriesContext";

export default function QuestionsPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [questionNames, setQuestionNames] = useState<string[]>([]);
  const { regenerateCategories, questionData } = useCategories();
  const router = useRouter();

  // Loads question names from questionData
  useEffect(() => {
    const fetchQuestions = async () => {
      if (questionData !== null) {
        const names = Object.keys(questionData);
        setQuestionNames(names);
      }
    };

    fetchQuestions();
  }, [questionData]);

  const handleSelectQuestion = async (questionName: string) => {
    setSelectedQuestion(questionName);
    await regenerateCategories(questionName);
    router.push(`/questions/${questionName}/categories`);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Select Question</h1>
      <ul>
        {questionNames.map((question, index) => (
          <li key={index}>
            <button
              onClick={() => handleSelectQuestion(question)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}