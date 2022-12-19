import React from "react";
import "./App.css";
import { HashRouter as Router, Route, Link, Routes } from "react-router-dom";
import { ProjectsPage } from "./components/ProjectsPage";
import { Login } from "./components/login";
import Mainpage from "./components/mainpage";
import Layout from "./components/layout";

function App() {
  return (
    <div className="">
      {/* <ProjectsPage /> */}
      
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="Mainpage" element={<Mainpage />} />

        {/* Optional index route if no nested routes match */}
        <Route index element={<Login />} />
      </Route>
    </Routes>
    </div>
  );
}

export default App;