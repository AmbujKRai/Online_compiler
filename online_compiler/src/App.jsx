import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import CodeEditor from "./components/codeEditor";
import SnippetLibrary from "./components/SnippetLibrary";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/codeEditor" />} />
        <Route path="/signin" element={<SignIn setUser={setUser} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/codeEditor" element={<CodeEditor user={user} />} />
        <Route path="/snippets" element={user ? <SnippetLibrary /> : <Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
};

export default App;
