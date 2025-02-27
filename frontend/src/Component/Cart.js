import React, { useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState({
    user: "Harsh Nama", 
    items: [],
    timestamp: new Date().toISOString(),
  });

  const addItemToCart = (product, quantity) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: [
        ...prevCart.items,
        { product, quantity, addedAt: new Date().toISOString() },
      ],
    }));
  };

  return (
    <div className="p-4 border rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold">Shopping Cart</h2>
      <p>User: {cart.user}</p>
      <p>Timestamp: {cart.timestamp}</p>
      <ul className="mt-2">
        {cart.items.map((item, index) => (
          <li key={index} className="border-b py-2">
            <strong>Product:</strong> {item.product} | <strong>Quantity:</strong> {item.quantity} | <strong>Added:</strong> {item.addedAt}
          </li>
        ))}
      </ul>
      <button
        onClick={() => addItemToCart("Laptop", 1)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Laptop to Cart
      </button>
    </div>
  );
};

export default Cart;
