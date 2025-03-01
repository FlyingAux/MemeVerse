"use client";
import React, { useState, useEffect } from "react";
import { FaHeart, FaComment, FaUser, FaCrown } from "react-icons/fa";
import { getMemes } from "../utils/indexedDB";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";


const TopMemes = () => {

  const router = useRouter();

  const [topMemes, setTopMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopMemes = async () => {
      setIsLoading(true);
      const allMemes = await getMemes();
      const sortedMemes = allMemes.sort((a, b) => b.likes - a.likes).slice(0, 10);
      setTopMemes(sortedMemes);
      setIsLoading(false);
    };

    fetchTopMemes();
  }, []);

  return (
    <div className="py-24 px-4 md:px-8 bg-slate-50 dark:bg-purple-300 min-h-screen">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl text-purple-600 font-bold mb-3">
            🏆 Top 10 Most Liked Memes
          </h2>
          <p className="text-gray-600 dark:text-white text-lg max-w-2xl mx-auto">
            The cream of the crop - our community's most loved meme creations
          </p>
        </motion.div>

        {isLoading ? (
          <div className=" flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 "></div>
          </div>
        ) : topMemes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topMemes.map((meme, index) => (
              <motion.div
                key={meme.id}
                className="rounded-xl overflow-hidden shadow-xl bg-purple-100 dark:bg-purple-400 transform transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
              >
                <div className="relative">
                  <motion.img
                    src={meme.imageUrl}
                    alt={meme.title}
                    className="w-full h-64 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {index < 3 && (
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-br-lg font-bold flex items-center gap-2">
                      <FaCrown /> 
                      <span>#{index + 1}</span>
                    </div>
                  )}
                  
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg font-medium flex items-center gap-1">
                    <FaHeart /> {meme.likes || 0}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white truncate">{meme.title}</h3>
                    {meme.user && (
                      <div className="flex items-center text-purple-600 text-sm">
                        <FaUser className="mr-1" />
                        <span>{meme.user}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2 text-gray-700">
                      <FaComment className="text-black dark:text-purple-500" />
                      <h4 className="font-bold dark:text-purple-500">Top Comments</h4>
                    </div>
                    
                    <div className="max-h-40 bg-white dark:bg-purple-50 overflow-hidden space-y-2 ">
                      {meme.comments && meme.comments.length > 0 ? (
                        meme.comments.slice(0, 3).map((comment, index) => (
                          <motion.div 
                            key={index} 
                            className="p-2 bg-white dark:bg-purple-100 rounded-lg shadow-sm"
                            whileHover={{ x: 5 }}
                          >
                            <p className="text-gray-700 dark:text-purple-500">
                              <span className="font-semibold dark:text-purple-500">{comment.user}: </span> 
                              {comment.text}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No comments yet. Be the first!</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-red-500 font-semibold">
                      <FaHeart className="text-xl" />
                      <span className="text-lg">{meme.likes || 0} Likes</span>
                    </div>
                    
                    <motion.button
                      className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded-full text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/${meme.id}`)}
                    >
                      View Meme
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16 bg-white rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-gray-500">No memes available yet. Create the first viral meme!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TopMemes;