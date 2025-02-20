import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";



function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mess, setMess] = useState("");

  const handleForm = (e) => {
    e.preventDefault();

    if (email === "admin@example.com" && password === "password123") {
      setMess("✅ Login Successful!");
    } else {
      setMess("❌ Invalid Credentials. Try again.");
    }
  };

  return (
    <section id="login" className="d-flex align-items-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          
     
          <div className="col-md-3"></div>

       
          <div className="col-md-6">
            <div className="card shadow p-4">
              <h2 className="text-center">Login Here !!!</h2>
              <p className="text-center text-danger">{mess}</p>

              <form onSubmit={handleForm}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Login
                </button>
              
             <p className="text-left mt-2 mb-2  "> <Link to="/ForgotAccount"> Forgot Account</Link></p> 
               <Link to="/CreateAccount"><button className="btn btn-primary form-control">Create Account plz !!!</button></Link> 
              </form>
            </div>
          </div>

        
          <div className="col-md-3"></div>
        

        </div>
      </div>
    </section>
  );
}

export default UserLogin;
