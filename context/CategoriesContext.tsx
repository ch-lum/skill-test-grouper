"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateCategories, Category } from '@/lib/generateCategories';

// Question data is the data that's organized per question
interface QuestionData {
  [key: string]: {[key: string]: string};
}

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  regenerateCategories: (questionName: string) => Promise<void>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  questionData: QuestionData | null;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);

  // This might need to change after the preprocessing is implemented
  const setPreprocessedData = async (data: QuestionData) => {
    setQuestionData(data);
  }

  // For now since we just have the toy data
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("toy_data.json");
      const data = await response.json();
      setPreprocessedData(data);
    }

    fetchQuestions();
  }, []);

  // This function is used to fetch the categories for a specific question, might never be used
  const fetchCategories = async (questionName: string) => {
    const data = await generateCategories(questionName);
    setCategories(data);
    setLoading(false);
  };

  const regenerateCategories = async (questionName: string) => {
    setLoading(true);
    const data = await generateCategories(questionName); // might want a regenerate function so you don't just get the same groups over and over
    setCategories(data);
    setLoading(false);
    console.log('Categories loaded,', questionName);
  };

  return (
    <CategoriesContext.Provider value={{ categories, loading, regenerateCategories, setCategories, questionData }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};