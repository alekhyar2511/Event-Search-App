import React from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import { NavLink } from "react-router-dom";

import Form from './components/Form';
import Favorites from './components/Favorites';
import "./App.css"

function App() {
  return (
    <div>
      <Router>
        <Nav className="justify-content-end mt-2 mr-3" defaultActiveKey="/">
          <NavLink to="/search" className="nav-item">Search</NavLink>
          <NavLink to="/favorites" className="nav-item">Favorites</NavLink>
        </Nav>

        <Routes>
          <Route path="/" element={<Navigate to="/search" />} />
          <Route exact path="/search" element={<Form />} />
          <Route path="/favorites" element={<Favorites />}/>
        </Routes>
      </Router>
      <p className="" style={{ height: '20px', marginBottom: '0' }}></p>
    </div>
  );
}

export default App;
