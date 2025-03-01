"use client";
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

      window.location.href = "/profile";
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
          onClick={onClose}
        >
          <IoMdClose />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <motion.input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-3 w-full my-2 rounded-md focus:ring-2 focus:ring-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-3 w-full my-2 rounded-md focus:ring-2 focus:ring-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        />

        <motion.button
          onClick={handleAuth}
          className="bg-blue-500 text-white px-4 py-2 w-full rounded-md hover:bg-blue-600 transition-all duration-200 mt-4"
          whileHover={{ scale: 1.05 }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </motion.button>

        <motion.p
          className="text-sm text-blue-500 mt-2 text-center cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
          whileHover={{ color: "#3B82F6" }}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;