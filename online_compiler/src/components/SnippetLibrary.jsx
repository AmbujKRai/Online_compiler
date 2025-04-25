import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import "./SnippetLibrary.css";

const SnippetLibrary = () => {
  const [snippets, setSnippets] = useState([]);
  const [newSnippet, setNewSnippet] = useState({
    title: "",
    code: "",
    language: "javascript",
    description: "",
    tags: ""
  });
  const [isAddingSnippet, setIsAddingSnippet] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "cpp", name: "C++" },
    { id: "c", name: "C" }
  ];

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/signin");
        return;
      }

      const snippetsQuery = query(
        collection(db, "snippets"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(snippetsQuery);
      const snippetsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setSnippets(snippetsData);
    } catch (error) {
      console.error("Error fetching snippets:", error);
    }
  };

  const handleAddSnippet = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    try {
      const user = auth.currentUser;
      if (!user) {
        setError("Please sign in to save snippets");
        navigate("/signin");
        return;
      }

      if (!newSnippet.title || !newSnippet.code) {
        setError("Title and code are required");
        return;
      }

      const snippetData = {
        ...newSnippet,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        tags: newSnippet.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      };

      await addDoc(collection(db, "snippets"), snippetData);
      
      // Reset form and refresh snippets
      setNewSnippet({
        title: "",
        code: "",
        language: "javascript",
        description: "",
        tags: ""
      });
      setIsAddingSnippet(false);
      setSuccessMessage("Snippet saved successfully!");
      fetchSnippets();
    } catch (error) {
      console.error("Error adding snippet:", error);
      setError("Failed to save snippet. Please try again.");
    }
  };

  const handleDeleteSnippet = async (snippetId) => {
    try {
      await deleteDoc(doc(db, "snippets", snippetId));
      fetchSnippets();
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };

  const handleViewSnippet = (snippet) => {
    setSelectedSnippet(snippet);
  };

  const handleCloseSnippet = () => {
    setSelectedSnippet(null);
  };

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLanguage = filterLanguage === "all" || snippet.language === filterLanguage;
    
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="snippet-library-container">
      <div className="snippet-header">
        <h1>My Code Snippets</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddingSnippet(true)}
        >
          Add New Snippet
        </button>
      </div>

      <div className="snippet-filters">
        <input
          type="text"
          placeholder="Search snippets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
        <select
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value)}
          className="form-select"
        >
          <option value="all">All Languages</option>
          {languages.map(lang => (
            <option key={lang.id} value={lang.id}>{lang.name}</option>
          ))}
        </select>
      </div>

      {isAddingSnippet && (
        <div className="snippet-form-container">
          <h2>Add New Snippet</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <form onSubmit={handleAddSnippet}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={newSnippet.title}
                onChange={(e) => setNewSnippet({...newSnippet, title: e.target.value})}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Language</label>
              <select
                className="form-select"
                value={newSnippet.language}
                onChange={(e) => setNewSnippet({...newSnippet, language: e.target.value})}
                required
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Code</label>
              <textarea
                className="form-control code-textarea"
                value={newSnippet.code}
                onChange={(e) => setNewSnippet({...newSnippet, code: e.target.value})}
                required
                rows="10"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={newSnippet.description}
                onChange={(e) => setNewSnippet({...newSnippet, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-control"
                value={newSnippet.tags}
                onChange={(e) => setNewSnippet({...newSnippet, tags: e.target.value})}
                placeholder="e.g. function, algorithm, sorting"
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success">Save Snippet</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setIsAddingSnippet(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedSnippet && (
        <div className="snippet-detail-container">
          <div className="snippet-detail-header">
            <h2>{selectedSnippet.title}</h2>
            <button 
              className="btn btn-close"
              onClick={handleCloseSnippet}
            ></button>
          </div>
          <div className="snippet-detail-meta">
            <span className="badge bg-primary">{selectedSnippet.language}</span>
            <span className="snippet-date">
              {new Date(selectedSnippet.createdAt).toLocaleDateString()}
            </span>
          </div>
          {selectedSnippet.description && (
            <div className="snippet-description">
              <p>{selectedSnippet.description}</p>
            </div>
          )}
          <div className="snippet-code">
            <pre><code>{selectedSnippet.code}</code></pre>
          </div>
          {selectedSnippet.tags && selectedSnippet.tags.length > 0 && (
            <div className="snippet-tags">
              {selectedSnippet.tags.map((tag, index) => (
                <span key={index} className="badge bg-secondary me-1">{tag}</span>
              ))}
            </div>
          )}
          <div className="snippet-actions">
            <button 
              className="btn btn-danger"
              onClick={() => handleDeleteSnippet(selectedSnippet.id)}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="snippets-grid">
        {filteredSnippets.length > 0 ? (
          filteredSnippets.map(snippet => (
            <div key={snippet.id} className="snippet-card">
              <div className="snippet-card-header">
                <h3>{snippet.title}</h3>
                <span className="badge bg-primary">{snippet.language}</span>
              </div>
              <div className="snippet-card-preview">
                <pre><code>{snippet.code.substring(0, 100)}...</code></pre>
              </div>
              <div className="snippet-card-footer">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => handleViewSnippet(snippet)}
                >
                  View
                </button>
                <button 
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteSnippet(snippet.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-snippets">
            <p>No snippets found. Add your first code snippet!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SnippetLibrary; 