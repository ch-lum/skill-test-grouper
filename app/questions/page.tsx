"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/context/CategoriesContext";

export default function QuestionsPage() {
  const { fetchCategories, questionData } = useCategories();
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [questionNames, setQuestionNames] = useState<string[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  useEffect(() => {
    const fetchDisabledButtons = async () => {
      const disabled = localStorage.getItem("disabledButtons");
      if (disabled) {
        setDisabledButtons(JSON.parse(disabled));
      }
    };

    fetchDisabledButtons();
  }, [questionData]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("disabledButtons");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleSelectQuestion = async (questionName: string) => {
    setSelectedQuestion(questionName);
    setIsLoading(true);

    try{ 
      const response = await fetch(`/api/questions/${questionName}?questionName=${questionName}`, {
      method: 'GET', // Explicitly specifying the HTTP method
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const data = await response.json();
    
      // await regenerateCategories(questionName, questionData);
      setIsLoading(false);
      fetchCategories();
      router.push(`/questions/${questionName}/categories`);

    } catch (error) {
      console.error("Error selecting question:", error);
    }


    console.log(isLoading);

    const updatedDisabledButtons = [...disabledButtons, questionName];
    setDisabledButtons(updatedDisabledButtons);
    localStorage.setItem("disabledButtons", JSON.stringify(updatedDisabledButtons));
  };

  const handleFinish = () => {
    console.log("Finish button clicked");
    router.push("/download");
  }

  const allButtonsDisabled = questionNames.length > 0 && questionNames.every((question) => disabledButtons.includes(question));

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
      <h1 className="text-3xl font-semibold mb-6">Select Question</h1>
      <ul>
        {questionNames.map((question, index) => (
          <li key={index}>
            <button
              onClick={() => handleSelectQuestion(question)}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ${disabledButtons.includes(question) ? 'bg-gray-500 cursor-not-allowed hover:bg-gray-700' : ''}`}
              disabled={disabledButtons.includes(question)}
            >
              {question}
            </button>
          </li>
        ))}
      </ul>
      {allButtonsDisabled && (
        <button
          onClick={handleFinish}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Finish
        </button>
      )}
    </div>
  );
}