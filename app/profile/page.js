"use client";
import React, { useState, useEffect } from "react";
import { getMemes } from "../utils/indexedDB";
import { motion } from "framer-motion";

const Profile = () => {
  const [userMemes, setUserMemes] = useState([]);
  const [displayedMemes, setDisplayedMemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const memesPerPage = 6;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUserMemes = async () => {
        const allMemes = await getMemes();
        const filteredMemes = allMemes.filter((meme) => meme.user === user.username);
        setUserMemes(filteredMemes);
        setDisplayedMemes(filteredMemes.slice(0, memesPerPage));
      };

      fetchUserMemes();
    }
  }, [user]);

  const loadMoreMemes = () => {
    const nextPage = currentPage + 1;
    const newMemes = userMemes.slice(0, nextPage * memesPerPage);

    setDisplayedMemes(newMemes);
    setCurrentPage(nextPage);
  };

  if (!user) {
    return <h2 className="text-center text-2xl">Please log in to view your profile.</h2>;
  }

  return (
    <div className="py-20 px-4 md:px-8">
      <motion.h2
        className="text-3xl font-bold text-center mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Profile: {user.username}
      </motion.h2>
      <h2 className="text-xl font-semibold mt-5 text-center">Your Uploaded Memes</h2>

      {userMemes.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">You haven’t uploaded any memes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {displayedMemes.map((meme) => (
            <motion.div
              key={meme.id}
              className="border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={meme.imageUrl}
                alt={meme.title}
                className="w-full h-48 object-cover transform hover:scale-105 transition-all duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{meme.title}</h3>
                <p className="text-gray-600">Likes: {meme.likes}</p>

                <div className="mt-4">
                  <h4 className="font-semibold">Comments:</h4>
                  <div className="max-h-32 overflow-y-auto border rounded p-2 bg-gray-100 mt-2">
                    {meme.comments && meme.comments.length > 0 ? (
                      <ul className="list-none space-y-2">
                        {meme.comments.map((comment, index) => (
                          <li key={index} className="text-gray-700">
                            <strong>{comment.user}:</strong> {comment.text}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {displayedMemes.length < userMemes.length && (
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={loadMoreMemes}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
          >
            Load More
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;