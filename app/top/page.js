"use client";
import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { getMemes } from "../utils/indexedDB";
import { motion } from "framer-motion";

const TopMemes = () => {
  const [topMemes, setTopMemes] = useState([]);

  useEffect(() => {
    const fetchTopMemes = async () => {
      const allMemes = await getMemes();
      const sortedMemes = allMemes.sort((a, b) => b.likes - a.likes).slice(0, 10);
      setTopMemes(sortedMemes);
    };

    fetchTopMemes();
  }, []);

  return (
    <div className="py-24 px-4 md:px-8">
      <motion.h2
        className="text-3xl font-bold text-center text-blue-600 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        🏆 Top 10 Most Liked Memes
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
        {topMemes.length > 0 ? (
          topMemes.map((meme, index) => (
            <motion.div
              key={meme.id}
              className="border p-5 rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105 hover:shadow-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.3 }}
            >
              <motion.img
                src={meme.imageUrl}
                alt={meme.title}
                className="w-full h-96 object-cover rounded-md mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <h3 className="text-lg font-semibold text-gray-800">{meme.title}</h3>

              <div className="flex items-center gap-2 mt-2 text-red-500 text-xl">
                <FaHeart /> <span>{meme.likes || 0}</span>
              </div>

              <div className="mt-2">
                <h4 className="font-bold text-gray-800">Top Comments:</h4>
                <div className="max-h-24 overflow-y-auto border rounded-md p-2 bg-gray-50">
                  {meme.comments && meme.comments.length > 0 ? (
                    meme.comments.slice(0, 3).map((comment, index) => (
                      <p key={index} className="text-gray-700">
                        <strong>{comment.user}:</strong> {comment.text}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500">No comments yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No memes available.</p>
        )}
      </div>
    </div>
  );
};

export default TopMemes;
