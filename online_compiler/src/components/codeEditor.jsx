import React, { useState } from "react";
import { createSubmission, getSubmissionResult } from "../api";
import MonacoEditor from "@monaco-editor/react";
//needs:
//language change karne ke saath ek chota basic code with libraries and all likh ke aaye
//better styling
//toggle switch white reh jata h
//output ki width thodi fixed
//more languages
//live preview for html css

const CodeEditor = () => {
  const [code, setCode] = useState("// Write your code here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [languageId, setLanguageId] = useState(54);
  const [theme, setTheme] = useState("vs-dark");

  const handleCompile = async () => {
    try {
      const response = await createSubmission(code, languageId, input);
      const { token } = response.data;

      const interval = setInterval(async () => {
        const result = await getSubmissionResult(token);
        if (result.data.status.id > 2) {
          clearInterval(interval);
          setOutput(result.data.stdout || result.data.stderr || "No output");
        }
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setOutput("An error occurred while compiling.");
    }
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "vs-dark" ? "light" : "vs-dark"));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 bg-gray-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Online Code Compiler</h1>
        <button
          onClick={handleThemeToggle}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Toggle {theme === "vs-dark" ? "Light" : "Dark"} Theme
        </button>
      </header>

      <main className="flex flex-grow">
        <div className="w-2/3 p-4">
          <MonacoEditor
            height="500px"
            defaultLanguage="cpp"
            value={code}
            theme={theme}
            onChange={(value) => setCode(value || "")}
          />
        </div>

        <div className="w-1/3 p-4 bg-gray-100 text-black rounded">
          <div className="mb-4">
            <label className="block font-semibold">Custom Input:</label>
            <textarea
              rows="5"
              className="w-full p-2 border rounded"
              placeholder="Enter custom input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold">Select Language:</label>
            <select
              value={languageId}
              onChange={(e) => setLanguageId(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="54">C++</option>
              <option value="62">Java</option>
              <option value="71">Python</option>
              {/* needs more languages */}
            </select>
          </div>
          <button
            onClick={handleCompile}
            className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
          >
            Run Code
          </button>
          <div className="mt-4">
            <h3 className="font-semibold">Output:</h3>
            <pre className="bg-black text-white p-2 rounded h-40 overflow-y-auto">
              {output}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeEditor;
