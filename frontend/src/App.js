import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './Component/Header';
import Home from './Component/Home';
import NavBar from './Component/NavBar';
import Login from './Component/Login';
import Footer from "./Component/Footer";
import UserLogin from './Component/UserLogin';
import BussinessRegister from './Component/BussinessRegister';
import MobilesSummerypage from './Component/MobilesSummerypage';
import TvSummery from './Component/TvSummery';
import CreateAccount from './Component/CreateAccount';
import ForgotPassword from './Component/ForgotPassword';
import Smartwatchform from './Component/SmartWacthform';
import Laptops from './Component/Laptops';
import Books from './Component/Books';
import Fashion from './Component/Fashion';
import Computer from './Component/Computer';
import Electronic from './Component/Electronic';









function App() {
  return (
    <Router>
      <Header />
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/UserLogin" element={<UserLogin/>} />
        <Route path="/BussinessRegister" element={<BussinessRegister/>} />
        <Route path="/Mobile" element={<MobilesSummerypage/>} />
        <Route path="/Tv" element={<TvSummery/>} />
        <Route path="/CreateAccount" element={<CreateAccount/>} />
        <Route path="/ForgotAccount" element={<ForgotPassword/>} />
        <Route path="/Laptop" element={<Laptops/>} />
        <Route path="/Books" element={<Books/>} />
        <Route path="/SmartWatch" element={<Smartwatchform/>} />
        <Route path="/Fashion" element={<Fashion/>} />
        <Route path="/Computer" element={<Computer/>} />
        <Route path="/Electronic" element={<Electronic/>} />
       
        
        
      
      
       
      
    
    
       
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
