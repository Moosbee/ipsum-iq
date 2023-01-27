import React from "react";
import "./App.css";
import { HashRouter as Router, Route, Link, Routes } from "react-router-dom";
import { ProjectsPage } from "./components/ProjectsPage";
import { Login } from "./components/login";
import Mainpage from "./components/mainpage";
import Layout from "./components/layout";
import Entries from "./components/entries";
import Querylist from "./components/querylist";
import Timer from "./components/timer";

function App() {
  return (
    <div className="">
      
     
      <Routes>
        <Route path="/mainpage" element={<Mainpage />} />
        <Route path="/" element={<Layout />}/>
        <Route path="/Mainpage" element={<Mainpage />} />
        <Route path="/entries" element={<Entries/>}></Route>
        <Route path="/Entries" element={<Entries/>}></Route>

        {/* Optional index route if no nested routes match */}
          <Route index element={<Login />} />
        </Routes>
    </div>
  );
}

export default App;
