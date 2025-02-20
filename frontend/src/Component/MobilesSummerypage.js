import React, { useState } from "react";

const mobiles = [
  { name: "iPhone 15 Pro", brand: "Apple", price: "$999", specs: "A17 Bionic, 6.1-inch, 48MP Camera" },
  { name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: "$1199", specs: "Snapdragon 8 Gen 3, 6.8-inch, 200MP Camera" },
  { name: "OnePlus 12", brand: "OnePlus", price: "$799", specs: "Snapdragon 8 Gen 3, 6.7-inch, 50MP Camera" }
];

const brands = ["All", ...new Set(mobiles.map(mobile => mobile.brand))];

const MobilesSummaryPage = () => {
  const [selectedBrand, setSelectedBrand] = useState("All");

  const filteredMobiles = selectedBrand === "All" ? mobiles : mobiles.filter(mobile => mobile.brand === selectedBrand);

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ marginBottom: "10px" }}>
        {brands.map((brand, index) => (
          <button 
            key={index} 
            onClick={() => setSelectedBrand(brand)} 
            style={{ marginRight: "5px", padding: "5px", border: "1px solid #ccc", cursor: "pointer" }}>
            {brand}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gap: "10px" }}>
        {filteredMobiles.map((mobile, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
            <h2>{mobile.name}</h2>
            <p>Brand: {mobile.brand}</p>
            <p>Price: {mobile.price}</p>
            <p>{mobile.specs}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobilesSummaryPage;
