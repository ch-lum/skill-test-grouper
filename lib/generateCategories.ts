import { useCategories } from "@/context/CategoriesContext";
import openai from "./openai";
import { openaiPrompt } from "./prompt";

export interface Category {
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


const sortCategories = (categories: Category[]): Category[] => {
  return categories.sort((a, b) => {
    if (a.slug === "miscellaneous") return 1;
    if (b.slug === "miscellaneous") return -1;
    if (!a.default && b.default) return -1;
    if (a.default && !b.default) return 1;
    return 0;
  });
};

// Only select from data the fields that are needed (questionName)
export const generateCategories = async (questionName: string, questionData: any): Promise<Category[]> => {
  if (!questionData) {
    throw new Error("No question data found.");
  }
  console.log("generating categories for", questionName);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: openaiPrompt
      },
      {
        role: "user",
        content: JSON.stringify(questionData[questionName])
      }
    ]
  })

  const rawContent: string | null = completion.choices[0].message.content;
  if (!rawContent) {
    throw new Error("No categories found.");
  }
  const cleanedContent = rawContent.replace(/```json|```/g, '').trim();

  let categories: Category[];
  try {
    const parsedContent = JSON.parse(cleanedContent);

    // Check if the parsed content is a Map
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
  console.log(categories);
  return sortCategories(categories);
};

// export const generateCategories = async (questionName: string): Promise<Category[]> => {
//   const categories: Category[] = [
//     {
//       "slug": "miscellaneous",
//       "default": true,
//       "title": "Miscellaneous Errors",
//       "description": "Errors that don’t fit into other categories.",
//       "email": ["anastasiya@ucsd.edu", "jaden@ucsd.edu"],
//       "error_lines": {
//         "anastasiya@ucsd.edu": [2, 5],
//         "jaden@ucsd.edu": [1]
//       },
//       "default_deduction": -1
//     },
//     {
//       "slug": "minor-logical-errors",
//       "default": true,
//       "title": "Minor Logical Errors or Typos",
//       "description": "Small mistakes like syntax errors, misspellings, or sound logic with minor flaws.",
//       "email": ["jaden@ucsd.edu", "nim@ucsd.edu"],
//       "error_lines": {
//         "jaden@ucsd.edu": [1],
//         "nim@ucsd.edu": [7]
//       },
//       "default_deduction": -0.2
//     },
//     {
//       "slug": "fundamental-misunderstanding",
//       "default": true,
//       "title": "Fundamental Misunderstanding",
//       "description": "Solutions that indicate a complete lack of understanding of the problem.",
//       "email": ["anastasiya@ucsd.edu"],
//       "error_lines": {
//         "anastasiya@ucsd.edu": [2, 8]
//       },
//       "default_deduction": -1
//     },
//     {
//       "slug": "forgot-list-methods",
//       "default": false,
//       "title": "Forgot List Methods Are In Place",
//       "description": "Errors where students forgot that list methods modify the object in place.",
//       "email": ["nim@ucsd.edu", "chris@ucsd.edu", "anastasiya@ucsd.edu"],
//       "error_lines": {
//         "nim@ucsd.edu": [4],
//         "chris@ucsd.edu": [3],
//         "anastasiya@ucsd.edu": [2]
//       },
//       "default_deduction": -0.5
//     },
//     {
//       "slug": "missed-edge-cases",
//       "default": false,
//       "title": "Missed Edge Cases",
//       "description": "Errors where edge cases were not considered in the solution.",
//       "email": ["anastasiya@ucsd.edu", "nim@ucsd.edu"],
//       "error_lines": {
//         "anastasiya@ucsd.edu": [8],
//         "nim@ucsd.edu": [2]
//       },
//       "default_deduction": -0.7
//     },
//     {
//       "slug": "incorrect-variable-names",
//       "default": false,
//       "title": "Incorrect Variable Names",
//       "description": "Errors caused by using undefined or incorrectly named variables.",
//       "email": ["jaden@ucsd.edu"],
//       "error_lines": {
//         "jaden@ucsd.edu": [1]
//       },
//       "default_deduction": -0.3
//     }
//   ];

//   return sortCategories(categories);
// };