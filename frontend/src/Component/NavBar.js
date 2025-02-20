import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <section id ="Navbar">
 

      <nav className="navbar navbar-expand-lg navbar-light fixed-navbar">
        <div className="container-fluid">
          <ul className="navbar-nav ms-7">
            <li className="nav-item">
           <Link to="/Mobile" className="nav-link text-white">Mobile</Link>   
            </li>
            <li className="nav-item">
              <Link to="/Tv"className="nav-link text-white">TV</Link>
            </li>
            <li className="nav-item">
          <Link to="/Laptop" className="nav-link text-white"  >Laptops</Link>   
            </li>
            <li className="nav-item">
            <Link to="/Books" className="nav-link text-white">Books</Link>  
            </li>
            <li className="nav-item">
              <Link to="/Fashion"className="nav-link text-white"  >Fashion</Link>
            </li>
            <li className="nav-item">
            <Link to="/Computer"className="nav-link text-white" >Computer</Link> 
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
  );
}

export default Header;
