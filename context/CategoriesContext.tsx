"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateCategories, Category } from '@/lib/generateCategories';

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  regenerateCategories: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const regenerateCategories = async () => {
    setLoading(true);
    const data = await generateCategories();
    setCategories(data.categories);
    setLoading(false);
    console.log('Categories loaded');
  };

  useEffect(() => {
    regenerateCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading, regenerateCategories }}>
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
}