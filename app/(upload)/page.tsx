"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

console.log(process.env);

export default function UploadPage() {
  const debugging = true;

  const [folderFiles, setFolderFiles] = useState<File[]>([]);
  const [gradeFiles, setGradeFiles] = useState<File[]>([]);
  const router = useRouter();

  const onDropFolder = (acceptedFiles: File[]) => {
    setFolderFiles(acceptedFiles);
  };

  const onDropGrades = (acceptedFiles: File[]) => {
    setGradeFiles(acceptedFiles);
  };

  const { getRootProps: getRootPropsFolder, getInputProps: getInputPropsFolder } = useDropzone({
    onDrop: onDropFolder,
    multiple: true,
  });

  const { getRootProps: getRootPropsGrades, getInputProps: getInputPropsGrades } = useDropzone({
    onDrop: onDropGrades,
    multiple: false,
  });

  const handleUpload = () => {
    // Handle file upload logic here
    console.log("Folder Files:", folderFiles);
    console.log("Grade Files:", gradeFiles);

    // Redirect to the questions page
    router.push("/questions");
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold mb-6">Skill Test Grading Assistant</h1>
        <p className="text-lg">
          This tool was made to make awarding partial credit on skill tests easy.
          [Blurb blurb blurb].
          Upload the EdStem Python folder and the autograder file to get started.
        </p>
      </div>
      <h2 className="text-3xl font-semibold mb-4">File Upload</h2>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload Python Folder</h2>
        <div
          {...getRootPropsFolder()}
          className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer"
        >
          <input {...getInputPropsFolder()} />
          <p>Drag & drop folder files here, or click to select files</p>
        </div>
        <ul className="mt-4">
          {folderFiles.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload Grades</h2>
        <div
          {...getRootPropsGrades()}
          className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer"
        >
          <input {...getInputPropsGrades()} />
          <p>Drag & drop grade file here, or click to select file</p>
        </div>
        <ul className="mt-4">
          {gradeFiles.map((file) => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleUpload}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded 1 ${((folderFiles.length === 0 || gradeFiles.length === 0) && !debugging) ? 'bg-gray-500 cursor-not-allowed hover:bg-gray-700' : ''}}`}
        disabled={(folderFiles.length === 0 || gradeFiles.length === 0) && !debugging}
      >
        Upload Files
      </button>
    </div>
  );
}