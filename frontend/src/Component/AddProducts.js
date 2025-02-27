import React, { useState } from "react";

const AddProducts = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    compareAtPrice: "",
    images: [],
    stock: "",
    trackQuantity: true,
    status: "active",
    tags: [],
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, images: [...product.images, e.target.value] });
  };

  const handleTagChange = (e) => {
    setProduct({ ...product, tags: e.target.value.split(",") });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Added:", product);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold">Add Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="compareAtPrice"
          value={product.compareAtPrice}
          onChange={handleChange}
          placeholder="Compare at Price"
          className="p-2 border rounded"
        />
        <input
          type="text"
          onChange={handleImageChange}
          placeholder="Image URL"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="p-2 border rounded"
          required
        />
        <select
          name="status"
          value={product.status}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          type="text"
          onChange={handleTagChange}
          placeholder="Tags (comma-separated)"
          className="p-2 border rounded"
        />
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
