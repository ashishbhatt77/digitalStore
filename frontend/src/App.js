import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Footer from './Components/Footer';
import Login from './Components/Login';
import Singup from './Components/Singup';
import BussinessLogin from './Components/BussinessLogin';
import AdminLogin from './Components/AdminLogin';
import AdminDashboard from './Components/AdminDashboard';
import ProductAdd from './Components/ProductAdd';
import BussinessRegister from './Components/BussinessRegister';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="Login" element={<Login/>} />
        <Route path="Singup" element={<Singup/>} />
        <Route path="BusinessLogin" element={<BussinessLogin/>} />
        <Route path="BussinessRegister" element={<BussinessRegister/>} />
        <Route path="AdminLogin" element={< AdminLogin/>} />
        <Route path='AdminDashboard' element={<AdminDashboard/>} />
        <Route path='ProductAdd' element={<ProductAdd/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
