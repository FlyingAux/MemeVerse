"use client";
import React, { useState, useEffect } from "react";
import { getMemes, updateMeme } from "./utils/indexedDB";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { TbLocationShare } from "react-icons/tb";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegComment } from "react-icons/fa";
import CommentsModal from './utils/commentModal';
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allMemes, setAllMemes] = useState([]);
  const [displayedMemes, setDisplayedMemes] = useState([]);
  const [user, setUser] = useState(null);
  const [likedMemes, setLikedMemes] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [memeSource, setMemeSource] = useState("all"); // "all", "local", or "imgflip"
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const MEMES_PER_PAGE = 6;

  const openCommentsModal = (meme) => {
    setSelectedMeme(meme);
    setIsModalOpen(true);
  };

  // Function to fetch memes from ImgFlip API
  const fetchImgFlipMemes = async () => {
    try {
      const response = await fetch('https://api.imgflip.com/get_memes');
      const data = await response.json();
      
      if (data.success) {
        // Transform ImgFlip memes to match your app's meme structure
        const transformedMemes = data.data.memes.map(meme => ({
          id: `imgflip-${meme.id}`,
          title: meme.name,
          imageUrl: meme.url,
          user: "ImgFlip",
          date: new Date().toISOString(),
          likes: 0,
          comments: [],
          source: "imgflip"
        }));
        
        return transformedMemes;
      } else {
        console.error("ImgFlip API error:", data.error_message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching from ImgFlip API:", error);
      return [];
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(storedUser);
  
    if (storedUser) {
      const userLikes = JSON.parse(localStorage.getItem(`likedMemes_${storedUser.username}`)) || {};
      setLikedMemes(userLikes);
    }
  
    const fetchAllMemes = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching memes...");
        
        // Get local memes from IndexedDB
        const localMemes = await getMemes();
        console.log("Local memes fetched:", localMemes);
        
        // Add source property to identify local memes
        const taggedLocalMemes = localMemes.map(meme => ({
          ...meme,
          source: "local"
        }));
        
        // Get memes from ImgFlip API
        const imgFlipMemes = await fetchImgFlipMemes();
        console.log("ImgFlip memes fetched:", imgFlipMemes);
        
        // Combine both sources
        const combinedMemes = [...taggedLocalMemes, ...imgFlipMemes];
        
        if (combinedMemes.length === 0) {
          setHasMore(false);
        }
  
        setAllMemes(combinedMemes);
        loadInitialMemes(combinedMemes);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching memes:", error);
        setIsLoading(false);
      }
    };
  
    fetchAllMemes();
  }, []);

  const loadInitialMemes = (memes) => {
    // Filter memes based on selected source
    let filteredMemes = memes;
    if (memeSource === "local") {
      filteredMemes = memes.filter(meme => meme.source === "local");
    } else if (memeSource === "imgflip") {
      filteredMemes = memes.filter(meme => meme.source === "imgflip");
    }
    
    // Sort memes by date (newest first)
    const sortedMemes = [...filteredMemes].sort((a, b) => new Date(b.date) - new Date(a.date));
    const initialMemes = sortedMemes.slice(0, MEMES_PER_PAGE);
    setDisplayedMemes(initialMemes);
    setHasMore(sortedMemes.length > MEMES_PER_PAGE);
  };

  const fetchMoreMemes = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    // Filter memes based on selected source
    let filteredMemes = allMemes;
    if (memeSource === "local") {
      filteredMemes = allMemes.filter(meme => meme.source === "local");
    } else if (memeSource === "imgflip") {
      filteredMemes = allMemes.filter(meme => meme.source === "imgflip");
    }
    
    // Sort memes by date (newest first)
    const sortedMemes = [...filteredMemes].sort((a, b) => new Date(b.date) - new Date(a.date));
    const endIndex = nextPage * MEMES_PER_PAGE;
    const paginatedResults = sortedMemes.slice(0, endIndex);
    
    setDisplayedMemes(paginatedResults);
    setHasMore(sortedMemes.length > endIndex);
  };

  const handleLikeToggle = async (meme) => {
    if (!user) {
      toast.info('🚀 Login first to like memes!', {
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
      return;
    }

    const memeId = meme.id;
    const isCurrentlyLiked = likedMemes[memeId];

    const updatedMemes = allMemes.map((m) => {
      if (m.id === memeId) {
        const currentLikes = m.likes || 0;
        return { 
          ...m, 
          likes: isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1 
        };
      }
      return m;
    });

    setAllMemes(updatedMemes);

    const updatedLikes = { ...likedMemes };
    if (isCurrentlyLiked) {
      delete updatedLikes[memeId];
    } else {
      updatedLikes[memeId] = true;
    }

    setLikedMemes(updatedLikes);
    localStorage.setItem(`likedMemes_${user.username}`, JSON.stringify(updatedLikes));

    // Filter and update displayed memes
    let filteredMemes = updatedMemes;
    if (memeSource === "local") {
      filteredMemes = updatedMemes.filter(meme => meme.source === "local");
    } else if (memeSource === "imgflip") {
      filteredMemes = updatedMemes.filter(meme => meme.source === "imgflip");
    }
    
    const sortedMemes = [...filteredMemes].sort((a, b) => new Date(b.date) - new Date(a.date));
    const paginatedResults = sortedMemes.slice(0, currentPage * MEMES_PER_PAGE);
    setDisplayedMemes(paginatedResults);

    // Only update in IndexedDB if it's a local meme
    if (meme.source === "local") {
      try {
        const updatedMeme = updatedMemes.find(m => m.id === memeId);
        await updateMeme(updatedMeme);
      } catch (error) {
        console.error("Error updating meme:", error);
      }
    }
  };

  const handleComment = async (memeId) => {
    if (!user) {
      toast.info('💬 Login to share your thoughts!', {
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
      return;
    }

    const commentText = commentInputs[memeId]?.trim();
    if (!commentText) return;

    const newComment = { 
      user: user.username, 
      text: commentText,
      timestamp: new Date().toISOString()
    };

    const updatedMemes = allMemes.map((m) =>
      m.id === memeId ? { ...m, comments: [...(m.comments || []), newComment] } : m
    );

    setAllMemes(updatedMemes);
    
    setCommentInputs(prev => ({ ...prev, [memeId]: "" }));
    
    // Filter and update displayed memes
    let filteredMemes = updatedMemes;
    if (memeSource === "local") {
      filteredMemes = updatedMemes.filter(meme => meme.source === "local");
    } else if (memeSource === "imgflip") {
      filteredMemes = updatedMemes.filter(meme => meme.source === "imgflip");
    }
    
    const sortedMemes = [...filteredMemes].sort((a, b) => new Date(b.date) - new Date(a.date));
    const paginatedResults = sortedMemes.slice(0, currentPage * MEMES_PER_PAGE);
    setDisplayedMemes(paginatedResults);

    // Only update in IndexedDB if it's a local meme
    const targetMeme = updatedMemes.find(m => m.id === memeId);
    if (targetMeme && targetMeme.source === "local") {
      try {
        await updateMeme(targetMeme);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleSourceChange = (source) => {
    setMemeSource(source);
    setCurrentPage(1);
    
    let filteredMemes = allMemes;
    if (source === "local") {
      filteredMemes = allMemes.filter(meme => meme.source === "local");
    } else if (source === "imgflip") {
      filteredMemes = allMemes.filter(meme => meme.source === "imgflip");
    }
    
    const sortedMemes = [...filteredMemes].sort((a, b) => new Date(b.date) - new Date(a.date));
    const initialMemes = sortedMemes.slice(0, MEMES_PER_PAGE);
    setDisplayedMemes(initialMemes);
    setHasMore(sortedMemes.length > MEMES_PER_PAGE);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="py-24 px-4 bg-slate-50 dark:bg-purple-300 min-h-screen">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center justify-center h-96 rounded-xl bg-purple-100 dark:bg-purple-400 text-gray-900 px-6 mb-3 text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="mt-6 text-4xl font-semibold text-purple-500 dark:text-white"
            >
              Welcome to MemeVerse! The ultimate destination for meme lovers 🎉
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-4 text-lg text-gray-700"
            >
              Explore, upload, and interact with trending memes in a fun and engaging way. Like, comment, and rank the best memes!
            </motion.p>
          </motion.div>
        </div>

        {/* Source filter buttons */}
        <div className="flex justify-center mb-8 gap-4">
          <button
            onClick={() => handleSourceChange("all")}
            className={`px-6 py-2 rounded-full ${
              memeSource === "all" 
                ? "bg-purple-500 text-white" 
                : "bg-purple-100 text-purple-500 hover:bg-purple-200"
            } transition-colors`}
          >
            All Memes
          </button>
          <button
            onClick={() => handleSourceChange("local")}
            className={`px-6 py-2 rounded-full ${
              memeSource === "local" 
                ? "bg-purple-500 text-white" 
                : "bg-purple-100 text-purple-500 hover:bg-purple-200"
            } transition-colors`}
          >
            My Memes
          </button>
          <button
            onClick={() => handleSourceChange("imgflip")}
            className={`px-6 py-2 rounded-full ${
              memeSource === "imgflip" 
                ? "bg-purple-500 text-white" 
                : "bg-purple-100 text-purple-500 hover:bg-purple-200"
            } transition-colors`}
          >
            ImgFlip Memes
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="flex space-x-4 mb-4">
                <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
                <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
                <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
              </div>
              <p className="text-purple-500 font-medium">Loading memes from both sources...</p>
            </div>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={displayedMemes.length}
            next={fetchMoreMemes}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center my-8">
                <div className="animate-pulse flex space-x-4 items-center">
                  <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                  <span className="text-purple-500 font-medium">Loading more memes...</span>
                </div>
              </div>
            }
            endMessage={
              <p className="text-center text-gray-500 my-8">
                {displayedMemes.length === 0 
                  ? "No memes found. Try again later."
                  : "You've seen all the memes 😎"}
              </p>
            }
          >
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {displayedMemes.map((meme) => (
                  <motion.div
                    key={meme.id}
                    variants={itemVariants}
                    layout
                    className="bg-purple-100 dark:bg-purple-400 w-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* SOURCE BADGE */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        meme.source === "imgflip" 
                          ? "bg-blue-500 text-white" 
                          : "bg-green-500 text-white"
                      }`}>
                        {meme.source === "imgflip" ? "ImgFlip" : "Local"}
                      </span>
                    </div>
                    
                    {/* IMAGE part */}
                    <div className="relative overflow-hidden">
                      <img 
                        src={meme.imageUrl} 
                        alt={meme.title} 
                        className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-xl font-bold text-white">{meme.title}</h3>
                        <p className="text-gray-200 text-sm">by {meme.user}</p>
                      </div>
                    </div>
                    
                    {/* Part below Image */}
                    <div className="p-4">
                      {/* HEART AND COMMENT ICONS */}
                      <div className="flex items-center justify-start gap-3">
                        <button
                          onClick={() => handleLikeToggle(meme)}
                          className={`flex items-center gap-2 rounded-full transition-colors ${
                            likedMemes[meme.id] 
                              ? "text-red-500 " 
                              : "text-gray-500 "
                          }`}
                        >
                          {likedMemes[meme.id] ? (
                            <FaHeart className="text-2xl" />
                          ) : (
                            <FaRegHeart className="text-2xl text-black dark:text-red-50" />
                          )}
                        </button>
                        
                        <button onClick={() => openCommentsModal(meme)} className="text-2xl text-black dark:text-red-50 ">
                          <FaRegComment />
                        </button>

                        <span className="text-2xl text-black dark:text-red-50 mt-1">
                          <TbLocationShare />
                        </span>
                      </div>

                      {/* LIKES */}
                      <div className="flex items-center justify-start w-full gap-2 mt-2 mb-2">
                        <span className="font-medium">{meme.likes || 0}</span>
                        <h1 className="">Likes</h1>
                      </div>

                      {/* Comments Displayed here */}
                      <div className="mb-8">
                        <div className="max-h-10">
                          {meme.comments && meme.comments.length > 0 ? (
                            <ul className="space-y-2">
                              {meme.comments.slice(-1).map((comment, index) => (
                                <li key={index} className="flex flex-col gap-1">
                                  <div className="flex gap-1 items-center justify-start max-h-10">
                                    <span className="font-medium ">{comment.user} : </span>
                                    <p className="mt-1">{comment.text}</p>
                                  </div>

                                  <button onClick={() => openCommentsModal(meme)} className="text-left">
                                    View all {meme.comments?.length || 0} comments
                                  </button>
                                  
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-black dark:text-white text-center py-2 text-sm">No comments yet. Be the first!</p>
                          )}
                        </div>
                      </div>
                      
                      {/* COMMENT INPUT */}
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={commentInputs[meme.id] || ""}
                          onChange={(e) => setCommentInputs({ 
                            ...commentInputs, 
                            [meme.id]: e.target.value 
                          })}
                          placeholder="Add a comment..."
                          className="border border-gray-300 dark:bg-white dark:text-black rounded-lg p-2 flex-1 text-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleComment(meme.id);
                          }}
                        />
                        <button 
                          onClick={() => handleComment(meme.id)} 
                          className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition-colors"
                          disabled={!commentInputs[meme.id]?.trim()}
                        >
                          <IoMdSend />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </InfiniteScroll>
        )}
      </div>
      <CommentsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        meme={selectedMeme}
      />
    </div>
  );
};

export default Home;