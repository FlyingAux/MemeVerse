"use client";
import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import InfiniteScroll from "react-infinite-scroll-component";
import { getMemes, addMeme as saveMeme, updateMeme } from "./utils/indexedDB";
import { motion } from "framer-motion";

const Home = () => {
  const [memes, setMemes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [commentMap, setCommentMap] = useState({});
  const [likedMemes, setLikedMemes] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUser(JSON.parse(localStorage.getItem("loggedInUser")));
    }
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const data = await response.json();

      if (data.success && Array.isArray(data.data.memes)) {
        let fetchedMemes = data.data.memes.map((meme) => ({
          id: meme.id,
          title: meme.name,
          imageUrl: meme.url,
          likes: 0,
          comments: [],
        }));

        const storedMemes = (await getMemes()) || [];

        const mergedMemes = fetchedMemes.map(
          (meme) => storedMemes.find((m) => m.id === meme.id) || meme
        );

        setMemes(mergedMemes);

        mergedMemes.forEach((meme) => {
          if (meme.id) saveMeme(meme);
        });
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Error fetching memes:", error);
    }
  };

  const fetchMoreMemes = async () => {
    if (memes.length >= 20) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setHasMore(false);
    }, 1500);
  };

  const handleLike = async (memeId) => {
    if (!user) return alert("You must be logged in to like memes!");

    const isCurrentlyLiked = likedMemes[memeId];
    
    setMemes((prevMemes) => {
      const updatedMemes = prevMemes.map((meme) => {
        if (meme.id === memeId) {
          const newLikeCount = isCurrentlyLiked 
            ? Math.max(0, (meme.likes || 0) - 1) 
            : (meme.likes || 0) + 1;
          
          return { ...meme, likes: newLikeCount };
        }
        return meme;
      });

      const updatedMeme = updatedMemes.find((meme) => meme.id === memeId);
      if (updatedMeme) {
        updateMeme({ ...updatedMeme, likes: updatedMeme.likes });
      }

      return updatedMemes;
    });

    setLikedMemes((prev) => {
      if (isCurrentlyLiked) {
        const newState = { ...prev };
        delete newState[memeId];
        return newState;
      } else {
        return { ...prev, [memeId]: true };
      }
    });
  };

  const handleComment = async (memeId) => {
    if (!user) return alert("You must be logged in to comment!");
    if (!commentMap[memeId]?.trim()) return;

    const newComment = { user: user.username, text: commentMap[memeId] };

    setMemes((prevMemes) => {
      const updatedMemes = prevMemes.map((meme) =>
        meme.id === memeId
          ? { ...meme, comments: [...(meme.comments || []), newComment] }
          : meme
      );

      const updatedMeme = updatedMemes.find((meme) => meme.id === memeId);
      if (updatedMeme) {
        updateMeme({
          ...updatedMeme,
          comments: updatedMeme.comments,
        });
      }

      return updatedMemes;
    });

    setCommentMap((prev) => ({ ...prev, [memeId]: "" }));
  };

  return (
    <div className="py-24 bg-gradient-to-b from-purple-50 to-white dark:bg-gradient-to-b dark:from-purple-300 dark:to-white min-h-screen">
      <div className="container mx-auto px-4">
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

        <InfiniteScroll
          dataLength={memes.length}
          next={fetchMoreMemes}
          hasMore={hasMore}
          loader={
            <motion.div 
              className="text-center py-4 text-purple-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-center items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <p className="mt-2">Loading more memes...</p>
            </motion.div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {memes.map((meme) => (
              <motion.div
                key={meme.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="relative overflow-hidden group">
                  <img
                    src={meme.imageUrl}
                    alt={meme.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-1">{meme.title}</h3>
                
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => handleLike(meme.id)}
                      className={`transition-colors duration-200 flex items-center ${
                        likedMemes[meme.id] ? "text-red-500" : "text-gray-400 hover:text-red-500"
                      }`}
                      aria-label={likedMemes[meme.id] ? "Unlike meme" : "Like meme"}
                    >
                      {likedMemes[meme.id] ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                    </button>
                    <span className={`font-medium ${likedMemes[meme.id] ? "text-red-500" : "text-gray-500"}`}>
                      {meme.likes || 0}
                    </span>
                  </div>
                
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span>Comments</span>
                      {meme.comments && meme.comments.length > 0 && (
                        <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          {meme.comments.length}
                        </span>
                      )}
                    </h4>
                    
                    <div className="max-h-36 overflow-y-auto rounded-lg bg-gray-50 p-3 mb-3 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                      {meme.comments && meme.comments.length > 0 ? (
                        meme.comments.map((comment, index) => (
                          <div 
                            key={index} 
                            className="text-gray-700 text-sm mb-2 pb-2 border-b border-gray-100 last:border-0"
                          >
                            <span className="font-semibold text-purple-600">{comment.user}</span>
                            <p className="mt-1">{comment.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm italic">No comments yet. Be the first!</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200 focus-within:border-purple-300 focus-within:ring-1 focus-within:ring-purple-300 transition-all">
                      <input
                        type="text"
                        value={commentMap[meme.id] || ""}
                        onChange={(e) =>
                          setCommentMap({ ...commentMap, [meme.id]: e.target.value })
                        }
                        placeholder="Write a comment..."
                        className="border-none bg-transparent p-2 flex-1 focus:outline-none text-gray-700 text-sm"
                      />
                      <button
                        onClick={() => handleComment(meme.id)}
                        disabled={!commentMap[meme.id]?.trim()}
                        className={`p-2 rounded-full ${
                          commentMap[meme.id]?.trim() 
                            ? "text-purple-500 hover:bg-purple-100" 
                            : "text-gray-300 cursor-not-allowed"
                        } transition-colors`}
                        aria-label="Send comment"
                      >
                        <IoMdSend className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;