import fs from 'fs/promises';
import path from 'path';

async function readJsonFile(filePath: string): Promise<any> {
    try {
      const absolutePath = path.join(process.cwd(), filePath);
      const fileContents = await fs.readFile(absolutePath, 'utf-8');
      return JSON.parse(fileContents);
    } catch (error) {
      console.error('Failed to read JSON file:', error);
      throw error;
    }
  }

function addDocstringsToPrompt() {
    try {
        const docstrings = readJsonFile('@/public/docstrings.json');
        const docstringsString = JSON.stringify(docstrings, null, 2);
        console.log(docstringsString);
        const openaiPrompt = `
        You will reply with a JSON object that is code-readable and only the object.
        You will receive participant-submitted code snippets, indexed by student email, for errors. Group the submissions into exactly six categories. These categories must include the following **default categories**:

        1. **"Miscellaneous Errors"**: Errors that don’t fit into other categories.
        2. **"Minor Logical Errors or Typos"**: Small mistakes like syntax errors, misspellings, or sound logic with minor flaws.
        3. **"Fundamental Misunderstanding"**: Solutions that indicate a complete lack of understanding of the problem.

        In addition to these three default categories, generate three new AI-derived categories based on patterns observed in the submissions.

        For each category, return:
        - A URL-safe \`slug\` for routing (e.g., "minor-logical-errors").
        - Whether the category is a default category (true or false).
        - A \`title\` summarizing the category.
        - A \`description\` explaining the category in 1–2 sentences.
        - An array of emails (\`emails\`) identifying the students whose submissions fall into this category.
        - An array of line numbers for each email (\`error_lines\`) highlighting where the error occurs.

        Ensure that:
        - **Every email is included in at least one category.**
        - **Every email is associated with at least one error line.**
        - **Each category contains at least one email.**
        - If a email applies to multiple categories, include it in all relevant categories.
        - If a email does not fit into any generated categories, it must appear in "Miscellaneous Errors."
        - The slug for "Miscellaneous Errors" must be "miscellaneous."

        Additionally, assign a \`default_deduction\` for each category, ranging from -0.1 (minor mistakes) to -1 (severe mistakes). Use the following default deductions:
        - "Miscellaneous Errors": -1
        - "Minor Logical Errors or Typos": -0.2
        - "Fundamental Misunderstanding": -1
        For the new AI-generated categories, suggest an appropriate \`default_deduction\`.

        Input:
        {
            "submissions": {
                "chris@ucsd.edu": "<code snippet>",
                "anastasiya@ucsd.edu": "<code snippet>",
                ...
            }
        }

        Output:
        [
            {
            "slug": "...",
            "default": true,
            "title": "...",
            "description": "...",
            "emails": ["chris@ucsd.edu", "anastasiya@ucsd.edu"],
            "error_lines": { "chris@ucsd.edu": [2, 5], "anastasiya@ucsd.edu": [3] },
            "default_deduction": 0.1
            },
            ...
        ]

        To help you understand the input data, here are the docstrings and doctests for each question:
        ${docstringsString}
        `;
        return openaiPrompt;
    } catch (error) {
        console.error('Failed to add docstrings to prompt:', error);
        return '';
    }
}

export const openaiPrompt = addDocstringsToPrompt();