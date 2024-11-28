"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadPage() {
  const [folderFiles, setFolderFiles] = useState<File[]>([]);
  const [gradeFiles, setGradeFiles] = useState<File[]>([]);

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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-semibold mb-6">Upload Python Files</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload Folder</h2>
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
        onClick={() => {
          // Handle file upload logic here
          console.log("Folder Files:", folderFiles);
          console.log("Grade Files:", gradeFiles);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload Files
      </button>
    </div>
  );
}