"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { FaRankingStar } from "react-icons/fa6";
import { FiTrendingUp } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

const Nav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", password: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.username === formData.username && storedUser.password === formData.password) {
      setUser(storedUser);
      setIsModalOpen(false);
    } else {
      alert("Invalid credentials!");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(formData));
    setUser(formData);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      <div className="nav-main h-20 w-full flex items-center justify-center text-xl fixed z-50 bg-white shadow-md">
        <div className="nav-left h-20 w-1/2 flex items-center justify-start gap-5 px-20">
          <Link href="/" className="flex items-center gap-2">
            <IoMdHome /> Home
          </Link>
          <Link href="/top" className="flex items-center gap-2">
            <FaStar /> Top
          </Link>
          <Link href="/trending" className="flex items-center gap-2">
            <FiTrendingUp /> Trending
          </Link>
          <Link href="/rankings" className="flex items-center gap-2">
            <FaRankingStar /> Rankings
          </Link>
        </div>
        <div className="nav-right h-20 w-1/2 flex items-center justify-end gap-5 px-20">
          <h1 className="flex items-center justify-center">
            <IoIosSearch />
          </h1>
          {user ? (
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md">
              Logout ({user.username})
            </button>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Login/Sign-up
            </button>
          )}
          <Link href="/uploadmeme" className="flex items-center justify-center">
            Upload meme
          </Link>
        </div>
      </div>


      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
 
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl"
            >
              <IoMdClose />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">{isSignup ? "Sign Up" : "Login"}</h2>
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="border p-2 rounded-md"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="border p-2 rounded-md"
              />
              <button type="submit" className="bg-green-500 text-white py-2 rounded-md">
                {isSignup ? "Sign Up" : "Login"}
              </button>
            </form>
            <p className="mt-3 text-center">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button className="text-blue-500 ml-1" onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
