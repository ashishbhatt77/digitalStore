import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const products = [
  { name: "Ready eCommerce", icon: "🛒", color: "bg-danger", link: "/Redycommerces" },
  { name: "ReadyPos", icon: "🛒", color: "bg-primary", link: "/" },
  { name: "Ready LMS", icon: "🎓", color: "bg-info", link: "/" },
  { name: "ePOS Pro", icon: "🛒", color: "bg-success", link: "/" },
  { name: "Laundry Management", icon: "🧺", color: "bg-dark", link: "/" },
  { name: "Maditam", icon: "🩸", color: "bg-secondary", link: "/" },
];

const DigitalProducts = () => {
  return (
    <div className="container py-5 text-center">
      <div className="mb-4">
        <h1 className="fw-bold text-primary">Digital Products</h1>
        <p className="text-muted fs-3">
          Transform your business with our revolutionary software solutions!
          Explore our suite of exceptional products designed to skyrocket your success!
        </p>
      </div>
      <div className="row g-4 justify-content-center">
        {products.map((product, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4">
            <Link to={product.link} className="text-decoration-none">
              <div className={`card text-white ${product.color} p-4 shadow-lg text-center transition-transform hover-scale`}>
                <span className="display-4">{product.icon}</span>
                <h3 className="mt-3 fw-semibold">{product.name}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DigitalProducts;
