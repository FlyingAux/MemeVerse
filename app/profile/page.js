"use client";
import React, { useState, useEffect } from "react";
import { getMemes } from "../utils/indexedDB";
import { motion } from "framer-motion";
import { FaRegSmileBeam, FaPen } from "react-icons/fa";
import { PiDotsThreeOutline } from "react-icons/pi";
import CommentsModal from "../utils/commentModal";

const Profile = () => {
  const [userMemes, setUserMemes] = useState([]);
  const [displayedMemes, setDisplayedMemes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const memesPerPage = 6;
  const [user, setUser] = useState(null);

    const [selectedMeme, setSelectedMeme] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const openCommentsModal = (meme) => {
      setSelectedMeme(meme);
      setIsModalOpen(true);
    };

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
    return <h2 className="text-center text-3xl text-gray-700 dark:text-white font-semibold mt-10">Loading ...</h2>;
  }

  return (
    <div className="py-24 px-6 md:px-12 max-w-6xl mx-auto  dark:bg-purple-300">
<div className="flex flex-col md:flex-row gap-5 items-center justify-center w-full p-5 rounded-xl bg-purple-100 dark:bg-purple-400 shadow-lg md:h-80">
      
  
      <div className="w-full md:w-[40%] flex items-center justify-center">
        <div className="h-32 w-32 md:h-40 md:w-40 border-2 border-black dark:border-white rounded-full bg-purple-300 flex items-center justify-center text-4xl md:text-5xl font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>
      </div>

    
      <div className="flex flex-col w-full md:w-[60%] items-center md:items-start justify-center gap-4 text-center md:text-left">
        
  
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start w-full gap-4">
          <motion.h2
            className="text-2xl md:text-3xl font-extrabold capitalize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {user.username}
          </motion.h2>
   
          <div className="flex gap-3 justify-center items-center">
            {[{ icon: FaPen, label: "Edit" }, { icon: PiDotsThreeOutline, label: "More" }].map((item, index) => (
              <div
                key={index}
                className="flex px-3 py-1 gap-2 items-center justify-center text-black dark:text-white text-sm md:text-lg border-black dark:border-white border-2 rounded-xl hover:bg-purple-400 dark:hover:bg-purple-500 hover:text-black transition-all duration-300 cursor-pointer shadow-md"
              >
                {React.createElement(item.icon)}
                <h1 className="font-semibold">{item.label}</h1>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center md:items-start gap-1">
          <h2 className="dark:text-white text-lg md:text-xl">{user.email}</h2>
          <h2 className="dark:text-white text-sm">+91 {user.phone.slice(0, 4)}XXXXXX</h2>
          <h2 className="font-medium dark:text-white text-black text-sm md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis.
          </h2>
        </div>
      </div>
    </div>
      
      <h2 className="text-2xl font-semibold mt-10 flex py-5 items-center justify-start text-gray-800 dark:text-white border-t-2 border-slate-200 dark:border-white ">Your Uploaded Memes</h2>
      {userMemes.length === 0 ? (
        <p className="text-gray-500 dark:text-white text-center mt-10">You haven’t uploaded any memes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {displayedMemes.map((meme) => (
            <motion.div
              key={meme.id}
              className="border border-gray-300 dark:border-purple-400 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-purple-100 dark:bg-purple-400"
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
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{meme.title}</h3>
                <p className="text-gray-600 dark:text-white mt-2">{meme.likes} Likes</p>


                <div className="mb-8">
                     <div className="max-h-10">
                       {meme.comments && meme.comments.length > 0 ? (
                         <ul className="space-y-2">
                           {meme.comments.slice(-1).map((comment, index) => (
                             <li key={index} className=" flex flex-col gap-1">
                             


                               <button onClick={() => openCommentsModal(meme)} className="text-left">View all  {meme.comments?.length || 0} comments</button>
                               <CommentsModal 
                                 isOpen={isModalOpen} 
                                 onClose={() => setIsModalOpen(false)} 
                                 meme={selectedMeme}
                               />



                             </li>
                           ))}
                         </ul>
                       ) : (
                         <p className="text-black dark:text-white text-center mt-5 py-2 text-sm">No comments yet. Be the first!</p>
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
