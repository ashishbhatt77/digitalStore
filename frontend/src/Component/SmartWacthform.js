import React, { useState } from "react";

function Smartwatchform() {
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("Black");

  const price = 4999; 

  const handleBuyNow = () => {
    alert(`Buying ${quantity} Smartwatch in ${color} color for ₹${quantity * price}`);
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} Smartwatch in ${color} color to cart!`);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center"
    style={{ minHeight: "80vh", marginTop: "10px", marginBottom: "10px" }}>

      <div className="card p-2 shadow" style={{ maxWidth: "400px" }}>
        <img src="wacth.jpg"  alt="Smartwatch" className="card-img-top mb-1 rounded" />
        <h3 className="text-center">Smartwatch Series X</h3>
        <p className="text-center text-muted">Premium fitness tracker with heart rate monitor</p>

        <div className="mb-3">
          <label className="form-label">Select Color</label>
          <select className="form-control" value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="Black">Black</option>
            <option value="Silver">Silver</option>
            <option value="Blue">Blue</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input 
            type="number" 
            className="form-control" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            min="1"
          />
        </div>

        <h4 className="text-center">Total Price: ₹{quantity * price}</h4>

        <div className="d-flex justify-content-between">
          <button className="btn btn-success w-50 me-2" onClick={handleBuyNow}>Buy Now</button>
          <button className="btn btn-primary w-50" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default Smartwatchform;
