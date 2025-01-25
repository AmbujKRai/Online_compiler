import React, { useState } from "react";
import { createSubmission, getSubmissionResult } from "../api";
import MonacoEditor from "@monaco-editor/react";

const languageTemplates = {
  54: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}`, // C++
  62: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`, // Java
  71: `print("Hello, World!")`, // Python
  63: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`, // C
};
//needs:
//more languages
//live preview for html css






const CodeEditor = () => {
  const [code, setCode] = useState(languageTemplates[54]);
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

  const handleLanguageChange = (e) => {
    const selectedLanguageId = Number(e.target.value);
    setLanguageId(selectedLanguageId);
    setCode(languageTemplates[selectedLanguageId] || "// Write your code here");
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "vs-dark" ? "light" : "vs-dark"));
  };

  return (
    <div className="d-flex flex-column vh-100 bg-dark text-white">
      <header className="bg-secondary p-3 d-flex justify-content-between align-items-center">
        <h1 className="fs-4 fw-bold">Online Code Compiler</h1>
        <button
          onClick={handleThemeToggle}
          className="btn btn-primary"
        >
          Toggle {theme === "vs-dark" ? "Light" : "Dark"} Theme
        </button>
      </header>

      <main className="d-flex flex-grow-1">
        <div className="col-8 p-3">
          <MonacoEditor
            height="500px"
            defaultLanguage="cpp"
            value={code}
            theme={theme}
            onChange={(value) => setCode(value || "")}
          />
        </div>

        <div className="col-4 p-3 bg-light text-dark rounded">
          <div className="mb-3">
            <label className="form-label fw-semibold">Custom Input:</label>
            <textarea
              rows="5"
              className="form-control"
              placeholder="Enter input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Select Language:</label>
            <select
              value={languageId}
              onChange={handleLanguageChange}
              className="form-select"
            >
              <option value="54">C++</option>
              <option value="62">Java</option>
              <option value="71">Python</option>
              <option value="63">C</option>
              {/* Add more languages as needed */}
            </select>
          </div>
          <button
            onClick={handleCompile}
            className="btn btn-success w-100"
          >
            Run Code
          </button>
          <div className="mt-3">
            <h3 className="fw-semibold">Output:</h3>
            <pre className="bg-dark text-white p-3 rounded" style={{ height: "160px", overflowY: "auto" }}>
              {output}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CodeEditor;
