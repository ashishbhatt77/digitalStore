import React from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link  } from "react-router-dom";
import { useEffect,useState } from "react";

const DealsOffers = () => {

  const [Deals, setDeals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/deals") 
      .then((response) => response.json())
      .then((data) => setDeals(data))
      .catch((error) => console.error("Error fetching deals:", error));
  }, []);
    const deals = [
      { id: 1, name: "Smartphone", discount: "20% OFF", image: "realistic-smartphone-device_.avif" },
      { id: 2, name: "Laptop", discount: "15% OFF", image: "macbook-laptop.avif" },
      { id: 3, name: "Smartwatch", discount: "10% OFF", image: "smart-watch.avif" },
      { id: 4, name: "Headphones", discount: "25% OFF", image: "black-wireless-headphones-.avif" },
    ];
  
    return (
      <section id="Dealsoffer" className="py-5 bg-Dark mt-0 mb-0">
        <div className="container">
          <h2 className="text-center mb-4 text-primary">🔥 Latest Deals & Offers</h2>
  
          <div className="position-relative overflow-hidden" style={{ width: "100%", whiteSpace: "nowrap" }}>
            <motion.div
              className="d-flex flex-row align-items-center gap-3"
              animate={{ x: ["0%", "-100%"] }} 
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              whileHover={{ x: "0%" }}
              style={{ width: "200%", display: "flex" }} 
            >
              {deals.concat(deals).map((deal, index) => (
                <motion.div
                  key={index}
                  className="card shadow-sm"
                  style={{ width: "250px", flexShrink: 0 }} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img src={deal.image} alt={deal.name} className="card-img-top" style={{ height: "180px", objectFit: "contain" }} />
                  <div className="card-body text-center">
                    <h5 className="card-title">{deal.name}</h5>
                    <p className="card-text text-danger fw-bold">{deal.discount}</p>
                  <Link to="/SmartWatch"><button className="btn btn-success w-100">Shop Now</button></Link>  
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    );
};

const TrendingGadgets = () => {
    const gadgets = [
        { id: 1, name: "iPhone 15 Pro", price: "₹1,34,999", image: "i phone15pro maxi.avif" },
        { id: 2, name: "Samsung Galaxy Z Fold 5", price: "₹1,49,999", image: "samsungz-5fold.jpg" },
        { id: 3, name: "MacBook M2 Pro", price: "₹2,09,999", image: "MacBook M2 Pro.jpg" },
        { id: 4, name: "Sony WH-1000XM5", price: "₹29,999", image: "Soney.jpeg" },
        { id: 5, name: "Apple Watch Ultra", price: "₹89,999", image: "Apple2.jpg" },
    ];

    return (
        <section  id="Trending"className="py-5 bg-light">
            <div className="container">
                <h2 className="text-center mb-4 text-primary">🔥 Trending Gadgets</h2>
                <motion.div
                    className="d-flex overflow-auto gap-3 p-2"
                    whileTap={{ cursor: "grabbing" }}
                    style={{ whiteSpace: "nowrap" }}
                >
                    {gadgets.map((gadget) => (
                        <motion.div
                            key={gadget.id}
                            className="card shadow-sm p-2 flex-shrink-0"
                            style={{ width: "250px" }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={gadget.image}
                                alt={gadget.name}
                                className="card-img-top"
                                style={{ height: "180px", objectFit: "cover" }}
                            />
                            <div className="card-body text-center">
                                <h5 className="card-title">{gadget.name}</h5>
                                <p className="card-text fw-bold text-secondary">{gadget.price}</p>
                                <button className="btn btn-success w-100">Buy Now</button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};


export { DealsOffers, TrendingGadgets };
