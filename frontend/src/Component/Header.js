import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faStore, faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Tooltip } from "bootstrap"; 

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products] = useState([
    "Smartwatch",
    "Laptops",
    "Headphones",
    "Mobile",
    "TV",
    "Electrical",
    "Sell",
    "Tablet",
    "Charger",
    "Mouse",
    "Keyboard",
  ]);

  const filteredProducts = products.filter((product) =>
    product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min").then((bootstrap) => {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });
  }, []);

  return (
    <>
      <style>
        {`
          body {
            padding-top: 120px; 
          }
        `}
      </style>

      <section id="Header">
    
        <nav
          className="navbar navbar-expand-lg"
          style={{
            position: "fixed",
            top: "0px",
            width: "100%",
            zIndex: 500,
            backgroundImage: "linear-gradient(to right, rgb(85, 82, 82), black, rgb(206, 200, 200), black)",
            padding: "15px",
            paddingBottom: "5px"
          }}
        >
          <div className="container-fluid">
            <img
              src="Colorful Mascot Illustrative Online Shop Logo (1).png"
              alt="Logo"
              style={{ height: "52px", marginBottom: "3px" }}
            />

            <form className="d-flex align-items-center mb-3 ms-5">
              <div className="input-group position-relative text-center">
                <input
                  className="form-control rounded-pill ps-4 pe-5"
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text bg-transparent border-0 position-absolute end-0 pe-2">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>
            </form>

            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link 
                  className="nav-link text-white" 
                  to="/" 
                  data-bs-toggle="tooltip" 
                  data-bs-placement="bottom" 
                  title="Home"
                >
                  <FontAwesomeIcon icon={faHouse} className="me-1 fa-lg" />
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link text-white" 
                  to="/Login" 
                  data-bs-toggle="tooltip" 
                  
                  data-bs-placement="bottom" 
                  title="Business Login"
                >
                  <FontAwesomeIcon icon={faStore} className="me-1 fa-lg" />
                  
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link text-white" 
                  to="/UserLogin" 
                  data-bs-toggle="tooltip" 
                  data-bs-placement="bottom" 
                  title="User Login"
                >
                  <FontAwesomeIcon icon={faUser} className="me-1 fa-lg" />
                </Link>
              </li>
            </ul>
          </div>
        </nav>

      
        <nav
          className="navbar navbar-expand-lg mb-3"
          style={{
            position: "fixed",
            top: "70px",
            width: "100%",
            zIndex: 700,
            backgroundColor: "rgb(71, 114, 199)",
            padding: "10px",
          }}
        >
          <div className="container-fluid">
            <ul className="navbar-nav ms-7">
              <li className="nav-item">
                <Link to="/Mobile" className="nav-link text-white">Mobile</Link>
              </li>
              <li className="nav-item">
                <Link to="/Tv" className="nav-link text-white">TV</Link>
              </li>
              <li className="nav-item">
                <Link to="/Laptop" className="nav-link text-white">Laptops</Link>
              </li>
              <li className="nav-item">
                <Link to="/Books" className="nav-link text-white">Books</Link>
              </li>
              <li className="nav-item">
                <Link to="/Fashion" className="nav-link text-white">Fashion</Link>
              </li>
              <li className="nav-item">
                <Link to="/Computer" className="nav-link text-white">Computer</Link>
              </li>
              <li className="nav-item">
                <Link to="/Electronic" className="nav-link text-white">Electronic</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">Sell</a>
              </li>
            </ul>
          </div>
        </nav>
      </section>
    </>
  );
}

export default Header;
