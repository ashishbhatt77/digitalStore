import React, { useState } from "react";

const UserData = () => {
  const [user, setUser] = useState({
    name: "",
    mobile: "",
    email: "",
    pass: "",
    cartId: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User Data Submitted:", user);
  };

  return (
    <div>
      <h2>User Data</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} required />
        <input type="text" name="mobile" placeholder="Mobile" value={user.mobile} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required />
        <input type="password" name="pass" placeholder="Password" value={user.pass} onChange={handleChange} required />
        <input type="text" name="cartId" placeholder="Cart ID" value={user.cartId} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserData;
