import React, { useState } from 'react';


const AddProducts = () => {
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
   
   
  if (isNaN(price) || isNaN(stock)) {
      alert('Price and stock must be numbers');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('size', size);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('stock', stock);

    try {
      const response = await fetch.post('http://localhost:5000/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, 
      });

      alert(response.data.message || 'Product added successfully');

      setName('');
      setSize('');
      setCategory('');
      setPrice('');
      setDescription('');
      setImage(null);
      setStock('');
    } catch (error) {
      console.error('❌ Error adding product:', error);
      alert(error.response?.data?.message || 'Error adding product');
    } finally {
      setLoading(false);
      
    }
  };


  return (
    <div className="container d-flex justify-content-center align-items-center mt-5 mb-5 vh-100 w-100">
      <div className="card shadow-lg p-4 rounded w-50">
        <h2 className="text-center">Add Product</h2>
        <form onSubmit={handleSubmit} className="w-100">
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Size</label>
            <input type="text" className="form-control" value={size} onChange={(e) => setSize(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input 
              type="number" 
              className="form-control" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-control" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            ></textarea>
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input 
              type="number" 
              className="form-control" 
              value={stock} 
              onChange={(e) => setStock(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Image</label>
            <input 
              type="file" 
              className="form-control" 
              onChange={(e) => setImage(e.target.files[0])} 
              required 
            />
            {image && (
              <div className="mt-3">
                <strong>Image Preview:</strong>
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                />
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary mt-3 w-100" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
