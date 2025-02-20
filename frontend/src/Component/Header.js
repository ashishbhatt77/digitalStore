import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faStore, faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products] = useState([
    "Smartwatch",
    "Laptops",
    "Headphones",
    "Mobile",
    "Tv",
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

  return (
    <>
      <section id="header">
        <nav className="navbar navbar-expand-lg text-blue custom-navbar shadow-sm">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img
                src="Colorful Mascot Illustrative Online Shop Logo (1).png"
                alt="Logo"
                style={{ height: "50px" }}
              />
            </div>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapsibleNavbar"
              aria-controls="collapsibleNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            
            <form className="d-flex align-items-center ms-5">
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

            <div className="collapse navbar-collapse mt-4" id="collapsibleNavbar">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link text-dark ms-2 fs-5" to="/">
                    <FontAwesomeIcon icon={faHouse} className="me-1 fa-lg" />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark ms-2 fs-5" to="/Login">
                    <FontAwesomeIcon icon={faStore} className="me-1 fa-lg" />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark ms-2 fs-5" to="/UserLogin">
                    <FontAwesomeIcon icon={faUser} className="me-1 fa-lg" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        
        {searchTerm && (
          <div className="search-results position-absolute bg-white shadow p-2" style={{ top: "70px", left: "50%", transform: "translateX(-50%)", width: "300px", borderRadius: "5px" }}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div key={index} className="p-2 border-bottom">
                  {product}
                </div>
              ))
            ) : (
              <div className="p-2 text-muted">No results found</div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

export default Header;
