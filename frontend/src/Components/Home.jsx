import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import img1 from './Image/image copy 2.png';
import img2 from './Image/image copy.png';
import img3 from './Image/image.png';
import './Css/Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/product')
      .then(response => setProducts(response.data.products))
      .catch(error => alert("Error fetching products!"));
  }, []);

  const addToCart = (product) => setCart(prevCart => [...prevCart, product]);
  const removeFromCart = (productId) => setCart(cart.filter(item => item._id !== productId));

  const toggleCart = () => setShowCart(!showCart);
  const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          {/* Replaced <a> tag with <button> */}
          <button className="navbar-brand" onClick={() => {/* You can add some logic if needed */}} >
            My Shop
          </button>
          <Button variant="primary" onClick={toggleCart}>
            My Cart ({cart.length})
          </Button>
        </div>
      </nav>

      <div id="demo" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {[img1, img2, img3].map((img, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
              <img src={img} alt={`Slide ${index + 1}`} className="d-block w-100" />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" />
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
          <span className="carousel-control-next-icon" />
        </button>
      </div>

      <div className="container mt-4">
        <div className="row">
          {products.map(product => {
            // Assuming the backend sends the relative image path
            const imageUrl = `http://localhost:5000${product.img}`; // Combine with base URL

            return (
              <div className="col-md-4 mb-4" key={product._id}>
                <div className="card">
                  <img src={imageUrl} alt={product.name} className="card-img-top" /> {/* Show Image */}
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">Category: {product.category}</p>
                    <p className="card-text">Price: ₹{product.price}</p>
                    <p className="card-text">Stock: {product.stock}</p>
                    <p className="card-text">{product.description}</p>
                    <Button className="btn btn-primary" onClick={() => addToCart(product)}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal show={showCart} onHide={toggleCart}>
        <Modal.Header closeButton>
          <Modal.Title>My Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length > 0 ? (
            <>
              <ul>
                {cart.map(item => (
                  <li key={item._id}>
                    {item.name} - ₹{item.price}
                    <Button variant="danger" size="sm" className="ms-2" onClick={() => removeFromCart(item._id)}>Remove</Button>
                  </li>
                ))}
              </ul>
              <h3>Total: ₹{totalAmount}</h3>
              <Button variant="success">Proceed to Payment</Button>
            </>
          ) : (
            <p>Your cart is empty</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Home;
