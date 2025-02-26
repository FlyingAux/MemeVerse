"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { FaRankingStar } from "react-icons/fa6";
import { FiTrendingUp } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import LoginModal from "./LoginModal";

const Nav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    window.location.href = "/"; // Redirect to home after logout
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
            <>
              <Link
                href="/profile"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Profile ({user.username})
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Login/Sign-up
            </button>
          )}

          <Link
            href="/memeUpload"
            className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
          >
            Upload Meme
          </Link>
        </div>
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogin={(user) => setUser(user)}
      />
    </>
  );
};

export default Nav;
