"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { FaRankingStar } from "react-icons/fa6";
import { FiTrendingUp } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import LoginModal from "./LoginModal";
import { AiOutlineClose } from "react-icons/ai";
import { motion } from "framer-motion";
import { RiMenu3Line } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { useTheme } from "next-themes";

const Nav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    window.location.href = "/";
  };

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null

  return (
    <>
  
      <motion.div
        className="nav-main h-20 w-full flex items-center bg-purple-100 dark:bg-purple-300 justify-between text-xl fixed z-50 px-4 sm:px-20 sm:flex hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="nav-left h-20 flex items-center justify-start gap-8 text-xl overflow-hidden sm:flex">

        <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3 py-1 rounded-lg bg-purple-400 dark:bg-purple-400 text-gray-800 dark:text-gray-200"
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
 
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
          >
            <Link href="/"  className="flex items-center justify-center gap-2 border-[1px] border-black dark:border-white py-1 px-3 rounded-lg hover:border-white hover:bg-purple-600 hover:text-white transition-all duration-200 hover:font-semibold">
              <IoMdHome /> Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          >
            <Link href="/top"  className="flex items-center justify-center gap-2 border-[1px] border-black dark:border-white py-1 px-3 rounded-lg  hover:border-white hover:bg-purple-600 hover:text-white transition-all duration-200 hover:font-semibold">
              <FaStar /> Top
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
          >
            <Link href="/memeFeed"  className="flex items-center justify-center gap-2 border-[1px] border-black dark:border-white py-1 px-3 rounded-lg  hover:border-white hover:bg-purple-600 hover:text-white transition-all duration-200 hover:font-semibold">
              <FiTrendingUp /> Explore
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 150 }}
          >
            <Link href="/rankings"  className="flex items-center justify-center gap-2 border-[1px] border-black dark:border-white py-1 px-3 rounded-lg  hover:border-white hover:bg-purple-600 hover:text-white transition-all duration-200 hover:font-semibold">
              <FaRankingStar /> Rankings
            </Link>
          </motion.div>
        </div>

        <div className="nav-right h-20 flex items-center justify-end gap-5 overflow-hidden sm:flex">
  
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
          >
          </motion.div>

          {user ? (
            <>
              <motion.div
                className="bg-blue-400 text-black dark:text-white px-3 py-1 rounded-md hover:bg-blue-600"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
              >
                <Link href="/profile">Profile</Link>
              </motion.div>

              <motion.button
                onClick={handleLogout}
                className="bg-red-400 text-black dark:text-white px-3 py-1 rounded-md hover:bg-red-600"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 150 }}
                whileHover={{ scale: 1.05 }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-black dark:text-white px-3 py-1 rounded-md hover:bg-blue-600"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 150, easing: "easeInOut"}}
              whileHover={{ scale: 1.05 }}
            >
              Login/Sign-up
            </motion.button>
          )}

          <motion.div
            className="bg-purple-400 text-black dark:text-white px-3 py-1 rounded-md hover:bg-purple-600"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: "spring", stiffness: 150 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/memeUpload">Upload Meme</Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="sm:hidden flex items-center justify-between p-5 w-full bg-zinc-100 dark:bg-purple-300 fixed z-50">

        
        {isMobileMenuOpen ? (
          <motion.button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl text-gray-600 hover:text-purple-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <AiOutlineClose />
          </motion.button>
        ) : (
          <motion.button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-2xl text-gray-500 hover:text-purple-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
           <RiMenu3Line />
          </motion.button>
        )}
        <h1 className="text-2xl tracking-wider font-bold text-purple-500 ">MemeVerse</h1>
      </div>


      {isMobileMenuOpen && (
        <motion.div
          className="sm:hidden flex flex-col items-start justify-start gap-3 px-3 py-3 w-1/2 bg-zinc-100 dark:bg-purple-300 h-screen top-16 fixed z-50"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >

          <motion.div
            className="text-lg hover:text-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/" className="flex items-center justify-center gap-2 h-fit"><span className="text-purple-500"><IoMdHome /></span> Home</Link>
          </motion.div>

          <motion.div
            className="text-lg hover:text-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/top" className="flex items-center justify-center gap-2"><span className="text-purple-500"><FaStar /></span> Top</Link>
          </motion.div>

          <motion.div
            className="text-lg hover:text-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/memeFeed" className="flex items-center justify-center gap-2"><span className="text-purple-500"><FiTrendingUp /></span> Explore</Link>
          </motion.div>

          <motion.div
            className="text-lg hover:text-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link href="/rankings" className="flex items-center justify-center gap-2"> <span className="text-purple-500"><FaRankingStar /></span> Rankings</Link>
          </motion.div>

          {user && (
            <motion.div
              className="text-lg hover:text-purple-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <Link href="/profile" className="flex items-center justify-center gap-2 "> <span className="text-purple-500"><CgProfile /></span> Profile</Link>
            </motion.div>
          )}

          <motion.div
            className="text-lg py-1 px-3 rounded-xl bg-purple-400 text-black dark:text-white hover:text-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Link href="/memeUpload" className="">Upload Meme</Link>
          </motion.div>

          {user ? (
            <motion.button
              onClick={handleLogout}
              className="bg-red-400 text-black dark:text-white px-3 py-1 rounded-md hover:bg-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              Logout
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 shadow-lg mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
            >
              Login/Sign-up
            </motion.button>

          )}

          <motion.button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="px-3 py-1 rounded-lg bg-purple-400 dark:bg-purple-400 text-gray-800 dark:text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
          {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </motion.button>
        </motion.div>
        
      )}
      
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogin={(user) => setUser(user)}
      />
    </>
  );
};

export default Nav;