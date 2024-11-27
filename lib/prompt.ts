export const openaiPrompt = `
  Analyze the following user-submitted code snippets, indexed by student PID, for errors. Group the submissions into exactly six categories. These categories must include the following **default categories**:

  1. **"Miscellaneous Errors"**: Errors that don’t fit into other categories.
  2. **"Minor Logical Errors or Typos"**: Small mistakes like syntax errors, misspellings, or sound logic with minor flaws.
  3. **"Fundamental Misunderstanding"**: Solutions that indicate a complete lack of understanding of the problem.

  In addition to these three default categories, generate three new AI-derived categories based on patterns observed in the submissions.

  For each category, return:
  - A URL-safe \`slug\` for routing (e.g., "minor-logical-errors").
  - A \`title\` summarizing the category.
  - A \`description\` explaining the category in 1–2 sentences.
  - An array of PIDs (\`pids\`) identifying the students whose submissions fall into this category.
  - An array of line numbers for each PID (\`error_lines\`) highlighting where the error occurs.

  Ensure that:
  - **Every PID is included in at least one category.**
  - If a PID applies to multiple categories, include it in all relevant categories.
  - If a PID does not fit into any generated categories, it must appear in "Miscellaneous Errors."

  Additionally, assign a \`default_deduction\` for each category, ranging from -0.1 (minor mistakes) to -1 (severe mistakes). Use the following default deductions:
  - "Miscellaneous Errors": -1
  - "Minor Logical Errors or Typos": -0.2
  - "Fundamental Misunderstanding": -1
  For the new AI-generated categories, suggest an appropriate \`default_deduction\`.

  Input:
  {
    "submissions": {
      "12345": "<code snippet>",
      "23456": "<code snippet>",
      ...
    }
  }

  Output:
  \`\`\`json
  {
    "categories": [
      {
        "slug": "...",
        "title": "...",
        "description": "...",
        "pids": ["12345", "23456"],
        "error_lines": { "12345": [2, 5], "23456": [3] },
        "default_deduction": ...
      },
      ...
    ]
  }
`;