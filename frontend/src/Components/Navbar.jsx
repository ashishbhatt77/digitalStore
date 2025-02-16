import React from 'react';
import './Css/Navbar.css';
import Logo from './Image/Digital Logo.png';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-white shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <img src={Logo} alt="Logo" style={{ width: '50px', height: '50px' }} />
          <h3 className="mt-3 ms-2 text-primary">DigitalStore</h3>
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar" aria-controls="collapsibleNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>


        {/* Search bar */}
        <form className="d-flex align-items-center w-auto ms-2 ">
          <div className="input-group w-100 position-relative">
            <input
              className="form-control rounded-pill ps-4 pe-5 "
              type="text"
              placeholder="Search"
            />
            <span className="input-group-text bg-transparent border-0 position-absolute end-0 pe-2">
              <i className="bi bi-search"></i>
            </span>
          </div>
        </form>




        {/* Navbar links and buttons */}
        <div className="collapse navbar-collapse mt-4" id="collapsibleNavbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link  text-black ms-2 fs-5" to="/">Home</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link  ms-2 fs-5" to="Login">
              <i class="fa-regular fa-circle-user fa-xl" style= {{color:"black"}}></i> 
                           </Link>
            </li>
            <li className="nav-item ">
              <Link className="nav-link text-white ms-1 fs-5"  to="Businesslogin">
                <button className="Nav_button btn btn-primary"  type="button">Business-Login</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
