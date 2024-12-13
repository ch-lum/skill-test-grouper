import { NextResponse } from 'next/server';
import {writeFile} from 'fs/promises';
import decompress from 'decompress';
import fs from 'fs-extra';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Disable Next.js default body parsing
export const config = {
  api: {
    bodyParser: false, // Disable default Next.js body parser
  },
};

// Handle the file upload
export async function POST(request: Request) {
  // Log the request headers for debugging
  console.log('Request Headers:', request.headers);
  console.log('Request Body:', request.body);

  const formData = await request.formData();
  const file = formData.get('zipFile');

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
  }

  const buffer = Buffer.from(await (file as Blob).arrayBuffer());
  await writeFile('public/data.zip', buffer);

  //unzip a file
  await decompress('public/data.zip', 'public/data');

  // Run the main function
  await main();

  return NextResponse.json({ status: 200, success: true, message: 'File uploaded successfully!' });
};

// Load data from a file
async function loadData(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
}

// Get the list of failed students from the grades file
async function getFailedStudents(filePath: string): Promise<Record<string, number[]>> {
    const gradesData = await fs.readFile(filePath, 'utf-8');
    const rows = gradesData.split('\n').map(line => line.split(','));
    const header1 = rows[0];
    const testSkillIndexes = Array.from({ length: 4 }, (_, i) =>
        header1.indexOf(`test_skill_${i + 1}`)
    );

    const header = rows[1];
    const failedIndex = header.indexOf('#FAILED');
    const erroredIndex = header.indexOf('#ERRORED');

    const failedStudents: Record<string, number[]> = {};

    for (let i = 2; i < rows.length; i++) {
        const line = rows[i];
        if (!line) continue;
        for (const testSkillIndex of testSkillIndexes) {
            if (line[testSkillIndex + 1] !== 'Passed') {
                const student = line[0];
                if (!failedStudents[student]) {
                    failedStudents[student] = [];
                }
                failedStudents[student].push(testSkillIndexes.indexOf(testSkillIndex) + 1);
            }
        }
    }

    return failedStudents;
}

// Split data by questions using a regex pattern
function splitByQuestions(data: string): string[] {
    data = removeDocstrings(data);
    const pattern = /# Question \d+/;
    return data.split(pattern);
}

async function getDocstrings(data: string): string[] {
  // Regular expression to match triple-quoted docstrings
  const docstringPattern = /(['"]{3})([\s\S]*?)(\1)/g;
  
  // Match all docstrings in the code
  const docstrings = data.match(docstringPattern);

  // // Match the first docstring in the code
  // const match = docstringPattern.exec(data);
  // const docstrings = match ? [match[0]] : [];

  if (!docstrings) {
    return [];
  }
  // Create an object where each docstring corresponds to its index with key "Question {index}"
  const docstringsObject = docstrings.reduce((acc, docstring, index) => {
    acc[`Question ${index}`] = docstring;
    return acc;
  }, {} as Record<string, string>);

  // Write the docstrings object to a new JSON file
  await writeFile('public/docstrings.json', JSON.stringify(docstringsObject, null, 2));

  return docstrings;
}

function removeDocstrings(code: string): string {
  // Regular expression to match triple-quoted docstrings
  const docstringPattern = /(['"]{3})([\s\S]*?)(\1)/g;

  // Remove all docstrings from the code
  return code.replace(docstringPattern, '');
}

// Create a JSON file with processed data
async function createJson(folderPath: string) {
    const failedStudents = await getFailedStudents('public/data/grades.csv');
    const dataDict: Record<string, Record<string, string>> = {
        'Question 1': {},
        'Question 2': {},
        'Question 3': {},
        'Question 4': {},
    };

    const subFolders = await fs.readdir(folderPath);

    for (const subFolder of subFolders) {
        if (subFolder === '.DS_Store') continue;

        const subFolderPath = path.join(folderPath, subFolder);
        const files = await fs.readdir(subFolderPath);

        for (const file of files) {
            if (file.endsWith('.py')) {
                const filePath = path.join(subFolderPath, file);
                const data = await loadData(filePath);
                const questions = splitByQuestions(data);
                const docstrings = await getDocstrings(data);


                for (let i = 1; i < questions.length; i++) {
                    const question = questions[i];
                    const code = removeDocstrings(question);
                    
                }

                // Generate a random email
                const email = `a${Array.from({ length: 9 }, () =>
                    Math.floor(Math.random() * 10)
                ).join('')}@ucsd.edu`;

                if (failedStudents[subFolder]) {
                    const questionIds = failedStudents[subFolder];
                    for (const questionId of questionIds) {
                        dataDict[`Question ${questionId}`][email] = questions[questionId];
                    }
                }
            }
        }
    }

    await fs.writeFile('public/data.json', JSON.stringify(dataDict, null, 2));
}

// Main function
async function main() {
    const folderPath = 'public/data/submissions';
    await createJson(folderPath);
    const data = await fs.readJson('public/data.json');
    console.log(data);
}


