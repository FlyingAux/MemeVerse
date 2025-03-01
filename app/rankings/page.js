"use client";
import React, { useState, useEffect } from "react";
import { FaHeart, FaTrophy, FaMedal } from "react-icons/fa";
import { getMemes } from "../utils/indexedDB";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Rankings = () => {

   const router = useRouter();

  const [rankings, setRankings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setIsLoading(true);
      const allMemes = await getMemes();

      const userMemeMap = {};

      allMemes.forEach((meme) => {
        if (meme.user && meme.likes > 0) {
          if (!userMemeMap[meme.user] || meme.likes > userMemeMap[meme.user].likes) {
            userMemeMap[meme.user] = meme;
          }
        }
      });

      const rankedUsers = Object.entries(userMemeMap)
        .map(([user, meme]) => ({ user, meme }))
        .sort((a, b) => b.meme.likes - a.meme.likes);

      setRankings(rankedUsers);
      setIsLoading(false);
    };

    fetchRankings();
  }, []);

  const getMedalIcon = (position) => {
    switch (position) {
      case 0:
        return <FaTrophy className="text-yellow-500 text-4xl" />;
      case 1:
        return <FaMedal className="text-gray-400 text-4xl" />;
      case 2:
        return <FaMedal className="text-amber-600 text-4xl" />;
      default:
        return <div className="text-3xl font-bold text-gray-700">#{position + 1}</div>;
    }
  };

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
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-purple-500 mb-3">
            🏆 Meme Leaderboard
          </h2>
          <p className="text-gray-600 dark:text-white text-lg max-w-2xl mx-auto">
            Showcasing the most popular memes from our creative community
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : rankings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rankings.map((entry, index) => (
              <motion.div
                key={entry.user}
                className="rounded-xl overflow-hidden shadow-xl bg-purple-100 dark:bg-purple-400 transform hover:translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              >
                <div className="relative">
                  <motion.img
                    src={entry.meme.imageUrl}
                    alt={entry.meme.title}
                    className="w-full h-64 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg font-medium flex items-center gap-1">
                    <FaHeart /> {entry.meme.likes}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getMedalIcon(index)}
                      <h3 className="text-2xl capitalize font-bold text-gray-800 dark:text-white">
                        {entry.user}
                      </h3>
                    </div>
                  </div>

                  <h4 className="text-lg font-medium text-gray-700 dark:text-white mb-2">{entry.meme.title}</h4>
                  
                  <motion.div 
                    className="mt-4 flex justify-between items-center"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="flex items-center gap-2 text-red-500 font-semibold">
                      <FaHeart className="text-xl" /> 
                      <span className="text-lg">{entry.meme.likes} Likes</span>
                    </div>
                    
                    <div className="bg-purple-600 hover:bg-purple-800 text-white px-3 py-2 rounded-full text-sm cursor-pointer">
                        <motion.button onClick={() => router.push(`/${entry.meme.id}`)}>
                          View Meme
                        </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-16 bg-white rounded-xl shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl text-gray-500">No memes have been liked yet. Be the first!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Rankings;