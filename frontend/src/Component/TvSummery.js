import React, { useState } from "react";

const tvs = [
  { name: "Samsung QLED 4K", brand: "Samsung", price: "$1200", specs: "55-inch, QLED, 4K UHD" },
  { name: "LG OLED C2", brand: "LG", price: "$1500", specs: "65-inch, OLED, 4K UHD" },
  { name: "Sony Bravia XR", brand: "Sony", price: "$1400", specs: "55-inch, OLED, 4K HDR" }
];

const brands = ["All", ...new Set(tvs.map(tv => tv.brand))];

const TvSummery = () => {
  const [selectedBrand, setSelectedBrand] = useState("All");

  const filteredTvs = selectedBrand === "All" ? tvs : tvs.filter(tv => tv.brand === selectedBrand);

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
        {filteredTvs.map((tv, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
            <h2>{tv.name}</h2>
            <p>Brand: {tv.brand}</p>
            <p>Price: {tv.price}</p>
            <p>{tv.specs}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TvSummery;
