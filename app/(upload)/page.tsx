"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

console.log(process.env);

export default function UploadPage() {
  const debugging = true;

  const [zipFile, setZipFile] = useState<File | null>(null);
  const router = useRouter();

  const handleUpload = async () => {
    if (!zipFile) {
      alert("Please select a ZIP file.");
      return;
    }

    const formData = new FormData();
    formData.append("zipFile", zipFile); // Add the ZIP file to the form data

    try {
      // Send the form data to the backend API for processing
      const response = await fetch("/api/upload-zip", {
        method: "POST",
        body: formData, // Send the file as FormData
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      // // Optionally, process the response (e.g., log or display success message)
      // const result = await response.json();
      // console.log("Upload result:", result);

      // Redirect to the questions page after successful upload
      router.push("/questions");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // const onDropFolder = (acceptedFiles: File[]) => {
  //   setFolderFiles(acceptedFiles);
  //   saveFilesLocally(acceptedFiles);
  // };

  // const onDropGrades = (acceptedFiles: File[]) => {
  //   setGradeFiles(acceptedFiles);
  //   saveFilesLocally(acceptedFiles);
  // };

  // const { getRootProps: getRootPropsFolder, getInputProps: getInputPropsFolder } = useDropzone({
  //   onDrop: onDropFolder,
  //   multiple: true,
  // });

  // const { getRootProps: getRootPropsGrades, getInputProps: getInputPropsGrades } = useDropzone({
  //   onDrop: onDropGrades,
  //   multiple: false,
  // });

  // const saveFilesLocally = (files: File[]) => {
  //   files.forEach(file => {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const fileContent = reader.result;
  //       // Save the file content locally (e.g., localStorage)
  //       localStorage.setItem(file.name, fileContent as string);
  //     };
  //     reader.readAsText(file);
  //   });
  // };

  // const handleUpload = async () => {
  //   // Handle file upload logic here
  //   console.log("Folder Files:", folderFiles);
  //   console.log("Grade Files:", gradeFiles);

  //   // Redirect to the questions page
  //   router.push("/questions");
  // }


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
            {/* Upload ZIP File */}
            <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload ZIP File</h2>
        <input
          type="file"
          accept=".zip"
          onChange={(e) => {
            if (e.target.files) {
              setZipFile(e.target.files[0]); // Store the selected ZIP file
            }
          }}
          className="border-2 border-gray-400 p-2 rounded-lg"
        />
        <p className="mt-2">{zipFile ? zipFile.name : "No file selected"}</p>
      </div>
      <button
        onClick={handleUpload}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${(
          !zipFile
        ) ? "bg-gray-500 cursor-not-allowed hover:bg-gray-700" : ""}`}
        disabled={!zipFile}
      >
        Upload Files
      </button>
    </div>
  );
}