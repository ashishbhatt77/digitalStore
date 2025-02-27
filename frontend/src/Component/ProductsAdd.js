import React, { useState } from "react";

const ProductsAdd = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    tags: "",
    image: null,
    status: "draft",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Added:", product);
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Product Name" className="w-full p-2 border mb-2 rounded" required />
        
        <textarea name="description" value={product.description} onChange={handleChange} placeholder="Product Description" className="w-full p-2 border mb-2 rounded" required></textarea>
        
        <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border mb-2 rounded" required />
        
        <input type="number" name="stock" value={product.stock} onChange={handleChange} placeholder="Stock Quantity" className="w-full p-2 border mb-2 rounded" required />
        
        <input type="text" name="category" value={product.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border mb-2 rounded" required />
        
        <input type="text" name="tags" value={product.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full p-2 border mb-2 rounded" />
        
        <input type="file" onChange={handleImageChange} className="w-full p-2 border mb-2 rounded" />
        
        <select name="status" value={product.status} onChange={handleChange} className="w-full p-2 border mb-2 rounded">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Add Product</button>
      </form>
    </div>
  );
};

export default ProductsAdd;
