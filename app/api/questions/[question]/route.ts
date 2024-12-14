import { NextResponse } from 'next/server';
import openai from "./openai";
import { openaiPrompt } from "./prompt";
import path from 'path';
import fs from 'fs/promises';

export interface Category {
  slug: string;
  default: boolean;
  title: string;
  description: string;
  emails: string[];
  error_lines: {
    [key: string]: number[];
  };
  default_deduction: number;
}

// Function to sort categories
const sortCategories = (categories: Category[]): Category[] => {
  return categories.sort((a, b) => {
    if (a.slug === "miscellaneous") return 1;
    if (b.slug === "miscellaneous") return -1;
    if (!a.default && b.default) return -1;
    if (a.default && !b.default) return 1;
    return 0;
  });
};

// Helper function to generate categories
const generateCategories = async (questionName: string, questionData: any): Promise<Category[]> => {
  if (!questionData) {
    throw new Error("No question data found.");
  }
  console.log("Generating categories for", questionName);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: openaiPrompt },
      { role: "user", content: JSON.stringify(questionData[questionName]) },
    ],
  });

  const rawContent: string | null = completion.choices[0]?.message?.content;
  if (!rawContent) {
    throw new Error("No categories found.");
  }

  const cleanedContent = rawContent.replace(/```json|```/g, "").trim();

  let categories: Category[];
  try {
    const parsedContent = JSON.parse(cleanedContent);

    if (parsedContent instanceof Map) {
      categories = Array.from(parsedContent.values());
    } else if (Array.isArray(parsedContent)) {
      categories = parsedContent;
    } else if (parsedContent.categories && Array.isArray(parsedContent.categories)) {
      categories = parsedContent.categories;
    } else {
      throw new Error("Parsed categories is not an array or a valid object");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to parse categories: " + error.message);
    } else {
      throw new Error("Failed to parse categories: " + String(error));
    }
  }
  return sortCategories(categories);
};

// API Route: GET Handler
export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const questionName = searchParams.get("questionName");

    if (!questionName) {
      return NextResponse.json(
        { error: "Missing 'questionName' parameter." },
        { status: 400 }
      );
    }

    // Replace this with your actual question data
    const filePath = path.join(process.cwd(), 'public', `data.json`);
    const fileContents = await fs.readFile(filePath, 'utf-8');
    const questionData = JSON.parse(fileContents);

    const categories = await generateCategories(questionName, questionData);

    const categoriesFilePath = path.join(process.cwd(), 'public', `categories.json`); //add ${questionName}- when figure out context stuff
    await fs.writeFile(categoriesFilePath, JSON.stringify(categories, null, 2));

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
