"use client";

import { useParams } from "next/navigation";
import { useCategories } from "@/context/CategoriesContext";

type Props = {
  children: React.ReactNode;
};


export default function ReviewLayout({ children, }: Props) {
  const { categories } = useCategories();
  const params = useParams();

  // Category data below //
  const categorySlug = params.category as string

  const categoryTitle = categories.find((cat) => cat.slug === categorySlug)?.title;
  const categoryDescription = categories.find((cat) => cat.slug === categorySlug)?.description;

  const categoryIndex = categories.findIndex((cat) => cat.slug === categorySlug);
  const categoryTotal = categories.length;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Reviewing Category {categoryIndex + 1}/{categoryTotal}: {categoryTitle}</h1>
      <p className="text-lg mb-6">{categoryDescription}</p>  
      {children}
    </div>
  );
}