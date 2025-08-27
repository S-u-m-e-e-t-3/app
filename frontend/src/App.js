import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GitComicGenerator from "./components/GitComicGenerator";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GitComicGenerator />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;