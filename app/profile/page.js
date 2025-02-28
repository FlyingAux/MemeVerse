"use client";
import React, { useState, useEffect } from "react";
import { getMemes } from "../utils/indexedDB";
import { motion } from "framer-motion";
import { FaRegSmileBeam, FaPen } from "react-icons/fa";
import { PiDotsThreeOutline } from "react-icons/pi";

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
    return <h2 className="text-center text-2xl text-gray-700 font-semibold mt-10">Please log in to view your profile.</h2>;
  }

  return (
    <div className="py-16 px-6 md:px-12 max-w-6xl mx-auto dark:bg-purple-300">
      <div className="flex flex-col gap-3 items-center justify-center h-auto w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white p-5 rounded-xl shadow-lg md:h-80">
        <div className="h-20 w-20 border-4 border-white rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <motion.h2
          className="text-3xl font-extrabold text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {user.username}
        </motion.h2>
        <h2 className="font-medium text-gray-200 text-center">Meme Enthusiast</h2>
        <div className="flex flex-wrap gap-4 mt-3 justify-center">
          {[{ icon: FaRegSmileBeam, label: "Set Status" }, { icon: FaPen, label: "Edit" }, { icon: PiDotsThreeOutline, label: "More" }].map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-white text-2xl border-white border-2 h-20 w-28 md:w-32 rounded-xl hover:bg-white hover:text-black transition-all duration-300 cursor-pointer shadow-md">
              {React.createElement(item.icon)}
              <h1 className="text-lg font-semibold mt-2 text-center">{item.label}</h1>
            </div>
          ))}
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mt-10 text-gray-800">Your Uploaded Memes</h2>
      {userMemes.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">You haven’t uploaded any memes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {displayedMemes.map((meme) => (
            <motion.div
              key={meme.id}
              className="border border-gray-300 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={meme.imageUrl}
                alt={meme.title}
                className="w-full h-80 object-cover transform hover:scale-105 transition-all duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{meme.title}</h3>
                <p className="text-gray-600">Likes: {meme.likes}</p>

                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700">Comments:</h4>
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
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={loadMoreMemes}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-purple-600 hover:to-blue-500 transition-all duration-300 font-semibold"
          >
            Load More
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
