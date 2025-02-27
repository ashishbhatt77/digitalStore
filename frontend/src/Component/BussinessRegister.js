import React, { useState } from "react";

const BussinessRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    email: "",
    category: "",
    businessName: "",
    registrationNumber: "",
    registrationDate: "",
    directorName: "",
    businessEmail: "",
    businessDesignation: "",
    businessMobile: "",
    password: "",
    gstNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registered Business:", formData);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md w-96">
      <h2 className="text-xl font-bold">Business Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type={key === "password" ? "password" : "text"}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            placeholder={key.replace(/([A-Z])/g, " $1").trim()}
            className="p-2 border rounded"
            required
          />
        ))}
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default BussinessRegister;
