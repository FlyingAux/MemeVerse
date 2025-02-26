"use client";
import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { getMemes } from "../utils/indexedDB";
import { motion } from "framer-motion";

const Rankings = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
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
    };

    fetchRankings();
  }, []);

  return (
    <div className="py-20 px-4 md:px-8">
      <motion.h2
        className="text-3xl font-bold text-center mb-10 text-blue-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        🏆 Meme Leaderboard
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
        {rankings.length > 0 ? (
          rankings.map((entry, index) => (
            <motion.div
              key={entry.user}
              className="border border-gray-300 rounded-lg shadow-lg p-5 bg-white transform hover:scale-105 transition-all duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-xl font-semibold text-gray-700">#{index + 1}</div>
                <div className="text-lg font-medium text-blue-600">{entry.user}</div>
              </div>

              <motion.img
                src={entry.meme.imageUrl}
                alt={entry.meme.title}
                className="w-full h-48 object-cover rounded-md mb-4 transition-transform duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
              />

              <h4 className="text-md font-semibold text-gray-800">{entry.meme.title}</h4>

              <div className="flex items-center gap-2 mt-2 text-red-500 text-lg">
                <FaHeart /> <span>{entry.meme.likes} Likes</span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No rankings available.</p>
        )}
      </div>
    </div>
  );
};

export default Rankings;