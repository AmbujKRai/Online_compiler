import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createSubmission, getSubmissionResult } from "../api";
import MonacoEditor from "@monaco-editor/react";

const languageTemplates = {
  54: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!";\n    return 0;\n}`, // C++
  62: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`, // Java
  71: `print("Hello, World!")`, // Python
  63: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`, // C
  "html": `<!DOCTYPE html>\n<html>\n<head>\n  <title>My Web Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>`,
  "css": `body {\n  margin: 0;\n  padding: 20px;\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: #333;\n}`
};

const CodeEditor = ({ user }) => {
  const [code, setCode] = useState(languageTemplates[54]);
  const [htmlCode, setHtmlCode] = useState(languageTemplates.html);
  const [cssCode, setCssCode] = useState(languageTemplates.css);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [languageId, setLanguageId] = useState(54);
  const [theme, setTheme] = useState("vs-dark");
  const [activeTab, setActiveTab] = useState("programming"); // "programming" or "web"
  const navigate = useNavigate();

  // Update preview when HTML or CSS changes
  useEffect(() => {
    if (activeTab === "web") {
      updatePreview();
    }
  }, [htmlCode, cssCode]);

  const updatePreview = () => {
    const previewContent = `
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>${htmlCode}</body>
      </html>
    `;
    const previewFrame = document.getElementById('preview-frame');
    if (previewFrame) {
      const frameDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
      frameDoc.open();
      frameDoc.write(previewContent);
      frameDoc.close();
    }
  };

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
    setOutput("");
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "vs-dark" ? "light" : "vs-dark"));
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  return (
    <div className="d-flex flex-column vh-100 bg-dark text-white">
      <header className="bg-secondary p-3 d-flex justify-content-between align-items-center">
        <h1 className="fs-4 fw-bold">Online Code Compiler</h1>
        <div>
          {user ? (
            <Link to="/snippets" className="btn btn-success me-2">
              My Snippets
            </Link>
          ) : (
            <button onClick={handleSignIn} className="btn btn-primary me-2">
              Sign In
            </button>
          )}
          <button onClick={handleThemeToggle} className="btn btn-light">
            Toggle {theme === "vs-dark" ? "Light" : "Dark"} Theme
          </button>
        </div>
      </header>

      <div className="p-3">
        <div className="btn-group mb-3">
          <button 
            className={`btn ${activeTab === 'programming' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('programming')}
          >
            Programming
          </button>
          <button 
            className={`btn ${activeTab === 'web' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('web')}
          >
            Web Development
          </button>
        </div>
      </div>

      {activeTab === 'programming' ? (
        <main className="d-flex flex-grow-1">
          <div className="col-8 p-3">
            <MonacoEditor
              height="500px"
              language={
                {
                  54: "cpp",
                  62: "java",
                  71: "python",
                  63: "c",
                }[languageId]
              }
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
              </select>
            </div>
            <button onClick={handleCompile} className="btn btn-success w-100">
              Run Code
            </button>
            <div className="mt-3">
              <h3 className="fw-semibold">Output:</h3>
              <pre
                className="bg-dark text-white p-3 rounded"
                style={{ height: "160px", overflowY: "auto" }}
              >
                {output}
              </pre>
            </div>
          </div>
        </main>
      ) : (
        <main className="d-flex flex-grow-1 p-3">
          <div className="col-8 d-flex flex-column gap-3">
            <div className="flex-grow-1">
              <h3 className="text-white mb-2">HTML</h3>
              <MonacoEditor
                height="300px"
                language="html"
                value={htmlCode}
                theme={theme}
                onChange={(value) => setHtmlCode(value || "")}
              />
            </div>
            <div className="flex-grow-1">
              <h3 className="text-white mb-2">CSS</h3>
              <MonacoEditor
                height="300px"
                language="css"
                value={cssCode}
                theme={theme}
                onChange={(value) => setCssCode(value || "")}
              />
            </div>
          </div>
          <div className="col-4 bg-light p-3 rounded">
            <h3 className="text-dark mb-3">Preview</h3>
            <iframe
              id="preview-frame"
              title="preview"
              className="w-100 h-100 border-0"
              style={{ backgroundColor: "white", minHeight: "600px" }}
            ></iframe>
          </div>
        </main>
      )}
    </div>
  );
};

export default CodeEditor;
