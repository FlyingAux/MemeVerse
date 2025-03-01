"use client";
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setUsername("");
      setEmail("");
      setPhone("");
      setPassword("");
      setErrors({});
      setIsSignup(false);
    }
  }, [isOpen]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10,}$/.test(phone);

  const handleInputChange = (field, value) => {
    let newErrors = { ...errors };

    if (field === "username" && !value) newErrors.username = "Username is required!";
    else delete newErrors.username;

    if (field === "email") {
      if (!value) newErrors.email = "Email is required!";
      else if (!validateEmail(value)) newErrors.email = "Invalid email format!";
      else delete newErrors.email;
    }

    if (field === "phone") {
      if (!value) newErrors.phone = "Phone number is required!";
      else if (!validatePhone(value)) newErrors.phone = "Must be at least 10 digits!";
      else delete newErrors.phone;
    }

    if (field === "password" && !value) newErrors.password = "Password is required!";
    else delete newErrors.password;

    setErrors(newErrors);

    switch (field) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleAuth = () => {
    if (Object.keys(errors).length > 0) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isSignup) {
      if (users.some((user) => user.username === username)) {
        setErrors({ username: "Username already exists!" });
        return;
      }

      users.push({ username, email, phone, password });
      localStorage.setItem("users", JSON.stringify(users));

      toast.success('Account successfully Created', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
      setIsSignup(false);
    } else {
      const validUser = users.find(
        (user) => user.username === username && user.password === password
      );

      if (!validUser) {
        setErrors({ username: "Invalid username or password!" });
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(validUser));
      onLogin(validUser);
      onClose();
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
      <ToastContainer />
      <motion.div
        className="bg-purple-100 dark:bg-purple-400 p-6 rounded-lg shadow-lg w-full max-w-sm relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <button
          className="absolute top-3 right-3 text-gray-600 dark:text-white hover:text-red-500 text-2xl"
          onClick={onClose}
        >
          <IoMdClose />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800 dark:text-white">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        {isSignup && (
          <>
            <motion.input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="border p-3 w-full my-2 rounded-md dark:bg-purple-50 dark:text-black  focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

            <motion.input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="border p-3 w-full my-2 rounded-md dark:bg-purple-50 dark:text-black  focus:ring-2 focus:ring-purple-500"
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </>
        )}

        <motion.input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          className="border p-3 w-full my-2 rounded-md dark:bg-purple-50 dark:text-black  focus:ring-2 focus:ring-purple-500"
        />
        {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}

        <motion.input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className="border p-3 w-full my-2 rounded-md dark:bg-purple-50 dark:text-black  focus:ring-2 focus:ring-purple-500"
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

        <motion.button
          onClick={handleAuth}
          className="bg-purple-500 text-black dark:text-white px-4 py-2 w-full rounded-md hover:bg-purple-600 transition-all duration-200 mt-4"
          whileHover={{ scale: 1.05 }}
        >
          {isSignup ? "Sign Up" : "Login"}
        </motion.button>

        <motion.p
          className="text-lg hover:text-black dark:hover:text-white text-black dark:text-white mt-3 text-center cursor-pointer"
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
