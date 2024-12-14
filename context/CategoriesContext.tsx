"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
//import { generateCategories, Category } from '@/lib/generateCategories';

// Question data is the data that's organized per question
interface QuestionData {
  [key: string]: {[key: string]: string};
}

  interface Category {
  slug: string;
  default: boolean;
  title: string;
  description: string;
  emails: string[];
  error_lines: {
    [key: string]: number[]
  };
  default_deduction: number;
}

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  regenerateCategories: (questionName: string) => Promise<void>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  questionData: QuestionData | null;
  csvData: any[];
  setCsvData: React.Dispatch<React.SetStateAction<any[]>>;
  fetchQuestions: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);

  //This might need to change after the preprocessing is implemented
  // const setPreprocessedData = async (data: QuestionData) => {
  //   setQuestionData(data);
  // }

  // For now since we just have the toy data
  
  const fetchQuestions = async () => {
    const response = await fetch("data.json");
    const data = await response.json();
    setQuestionData(data);
    console.log('Data loaded');
  }

  // For now since we just have the toy data
  const fetchCategories = async () => {
    const response = await fetch("categories.json");
    const data = await response.json();
    setCategories(data);
    setLoading(false);
  }

  const regenerateCategories = async (questionName: string) => {
    console.log('Data', questionData)
    //call api again
    try{ 
      const response = await fetch(`/api/questions/${questionName}?questionName=${questionName}`, {
      method: 'GET', // Explicitly specifying the HTTP method
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(data);
      setLoading(false);

    } catch (error) {
      console.error("Error selecting question:", error);
    }

    console.log('Categories loaded,', questionName);
  };

  return (
    <CategoriesContext.Provider value={{ categories, 
                                          loading, 
                                          regenerateCategories, 
                                          setCategories, 
                                          questionData, 
                                          csvData, 
                                          setCsvData, 
                                          fetchQuestions,
                                          fetchCategories }}>
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