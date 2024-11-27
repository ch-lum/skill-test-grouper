import openai from "./openai";

export interface Category {
  slug: string;
  default: boolean;
  title: string;
  description: string;
  email: string[];
  error_lines: {
    [key: string]: number[];
  };
  default_deduction: number;
}

// export const generateCategories = async () => {
//   return "test";
// );
export const generateCategories = async (): Promise<{ categories: Category[]}> => {
  return {"categories": [
    {
      "slug": "miscellaneous",
      "default": true,
      "title": "Miscellaneous Errors",
      "description": "Errors that don’t fit into other categories.",
      "email": ["anasta", "23456"],
      "error_lines": {
        "12345": [2, 5],
        "23456": [1, 4]
      },
      "default_deduction": -1
    },
    {
      "slug": "minor-logical-errors",
      "default": true,
      "title": "Minor Logical Errors or Typos",
      "description": "Small mistakes like syntax errors, misspellings, or sound logic with minor flaws.",
      "email": ["23456", "34567"],
      "error_lines": {
        "23456": [3],
        "34567": [7]
      },
      "default_deduction": -0.2
    },
    {
      "slug": "fundamental-misunderstanding",
      "default": true,
      "title": "Fundamental Misunderstanding",
      "description": "Solutions that indicate a complete lack of understanding of the problem.",
      "email": ["12345", "34567"],
      "error_lines": {
        "12345": [6],
        "34567": [2, 8]
      },
      "default_deduction": -1
    },
    {
      "slug": "forgot-list-methods",
      "default": false,
      "title": "Forgot List Methods Are In Place",
      "description": "Errors where students forgot that list methods modify the object in place.",
      "email": ["45678"],
      "error_lines": {
        "45678": [4]
      },
      "default_deduction": -0.5
    },
    {
      "slug": "missed-edge-cases",
      "default": false,
      "title": "Missed Edge Cases",
      "description": "Errors where edge cases were not considered in the solution.",
      "email": ["23456", "45678"],
      "error_lines": {
        "23456": [8],
        "45678": [2]
      },
      "default_deduction": -0.7
    },
    {
      "slug": "incorrect-variable-names",
      "default": false,
      "title": "Incorrect Variable Names",
      "description": "Errors caused by using undefined or incorrectly named variables.",
      "email": ["12345"],
      "error_lines": {
        "12345": [9]
      },
      "default_deduction": -0.3
    }
  ]};
};