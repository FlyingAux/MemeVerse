"use client";
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Reset fields when the modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setPassword("");
      setError("");
      setIsSignup(false); 
    }
  }, [isOpen]);

  const handleAuth = () => {
    if (!username || !password) {
      setError("All fields are required!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isSignup) {
      if (users.some((user) => user.username === username)) {
        setError("Username already exists!");
        return;
      }
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Account created successfully!");
      
  
      setUsername(""); 
      setPassword("");
      setError("");
      setIsSignup(false);
    } else {
      const validUser = users.find(
        (user) => user.username === username && user.password === password
      );

      if (!validUser) {
        setError("Invalid username or password!");
        return; 
      }

      localStorage.setItem("loggedInUser", JSON.stringify(validUser));
      onLogin(validUser);
      onClose(); 


      setUsername("");
      setPassword("");
      setError("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-md shadow-lg w-96 relative">

        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
          onClick={onClose}
        >
          <IoMdClose />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full my-2 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full my-2 rounded-md"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 w-full rounded-md"
          onClick={handleAuth}
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>

        <p
          className="text-sm text-blue-500 mt-2 text-center cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
