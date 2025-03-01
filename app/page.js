"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMemes, updateMeme } from "./utils/indexedDB";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { TbBrandFeedly } from "react-icons/tb";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegComment } from "react-icons/fa";
import { TbShare3 } from "react-icons/tb";
import { TbLocationShare } from "react-icons/tb";

const MemeFeed = () => {
  const router = useRouter();
  
  const [allMemes, setAllMemes] = useState([]);
  const [displayedMemes, setDisplayedMemes] = useState([]);
  const [user, setUser] = useState(null);
  const [likedMemes, setLikedMemes] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const MEMES_PER_PAGE = 6;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [category, setCategory] = useState("All");
  
  const categories = ["All", "Trending", "New", "Classic", "Random"];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(storedUser); // Allow home page to work even if no user is logged in
  
    if (storedUser) {
      const userLikes = JSON.parse(localStorage.getItem(`likedMemes_${storedUser.username}`)) || {};
      setLikedMemes(userLikes);
    }
  
    const fetchMemes = async () => {
      try {
        console.log("Fetching memes...");
        const fetchedMemes = await getMemes();
        console.log("Memes fetched:", fetchedMemes);
  
        if (fetchedMemes.length === 0) {
          setHasMore(false); // Prevent infinite scroll loop
        }
  
        setAllMemes(fetchedMemes);
        applyFiltersAndSort(fetchedMemes, 1);
      } catch (error) {
        console.error("Error fetching memes:", error);
      }
    };
  
    fetchMemes();
  }, []);

  const applyFiltersAndSort = useCallback((memeCollection, page = 1) => {

    let filteredResults = [...memeCollection];
    
    if (category !== "All") {
      filteredResults = filteredResults.filter(meme => 
        meme.category === category
      );
    }
    
    if (searchQuery.trim() !== "") {
      filteredResults = filteredResults.filter(meme =>
        meme.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    filteredResults.sort((a, b) => {
      switch (sortBy) {
        case "likes":
          return (b.likes || 0) - (a.likes || 0);
        case "comments":
          return ((b.comments?.length || 0) - (a.comments?.length || 0));
        case "date":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
    
    const startIndex = 0;
    const endIndex = page * MEMES_PER_PAGE;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);
    
    setDisplayedMemes(paginatedResults);
    setHasMore(filteredResults.length > endIndex);
    
    return { filteredCount: filteredResults.length, displayedCount: paginatedResults.length };
  }, [category, searchQuery, sortBy]);

  const handleSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      setCurrentPage(1);
      applyFiltersAndSort(allMemes, 1);
    }, 400),
    [applyFiltersAndSort, allMemes]
  );

  const handleSortChange = (newSortMethod) => {
    setSortBy(newSortMethod);
    setCurrentPage(1);
    applyFiltersAndSort(allMemes, 1);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    applyFiltersAndSort(allMemes, 1);
  };

  const fetchMoreMemes = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    applyFiltersAndSort(allMemes, nextPage);
  };

  const handleLikeToggle = async (meme) => {
    if (!user) {
      alert("You must be logged in to like memes!");
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
  
    applyFiltersAndSort(updatedMemes, currentPage);
  
    try {
      const updatedMeme = updatedMemes.find(m => m.id === memeId);
      await updateMeme(updatedMeme);
    } catch (error) {
      console.error("Error updating meme:", error);
    }
  };

  const handleComment = async (memeId) => {
    if (!user) {
      alert("You need to log in to comment.");
      return;
    }
  
    const commentText = commentInputs[memeId]?.trim();
    if (!commentText) return;
  
    const newComment = {
      user: user.username,
      text: commentText,
      timestamp: new Date().toISOString(),
    };
  
    let updatedMemes = allMemes.map((m) => {
      if (m.id === memeId) {
        const existingComments = m.comments || [];
  
        // Check if the user has already commented with the same text
        const existingCommentIndex = existingComments.findIndex(
          (c) => c.user === newComment.user && c.text === newComment.text
        );
  
        let updatedComments;
        if (existingCommentIndex !== -1) {
          // Remove the existing comment
          updatedComments = existingComments.filter(
            (_, index) => index !== existingCommentIndex
          );
        } else {
          // Add the new comment
          updatedComments = [...existingComments, newComment];
        }
  
        return { ...m, comments: updatedComments };
      }
      return m;
    });
  
    setAllMemes(updatedMemes);
    setCommentInputs((prev) => ({ ...prev, [memeId]: "" }));
  
    applyFiltersAndSort(updatedMemes, currentPage);
  
    try {
      const updatedMeme = updatedMemes.find((m) => m.id === memeId);
      await updateMeme(updatedMeme);
    } catch (error) {
      console.error("Error updating meme:", error);
    }
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
                ? "No memes match your filters. Try adjusting your search."
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

                // Individual memes 
                <motion.div
                  key={meme.id}
                  variants={itemVariants}
                  layout
                  className="bg-purple-100 dark:bg-purple-400 w-full rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >

                  {/* IMAGE part  */}
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
                  
                  {/* Part below Image  */}
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
                      
                      
                      <span className="text-2xl text-black dark:text-red-50 ">
                        <FaRegComment />
                      </span>

                      <span className="text-2xl text-black dark:text-red-50 mt-1">
                      <TbLocationShare />
                      </span>
                    </div>

                  {/* LIKES  */}
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
                              <li key={index} className=" flex flex-col gap-1">
                                <div className="flex gap-1 items-center justify-start max-h-10">
                                  <span className="font-medium ">{comment.user} : </span>
                                  <p className="  mt-1">{comment.text}</p>
                                </div>


                                <p>View all  {meme.comments?.length || 0} comments</p>



                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-100 text-center py-2 text-sm">No comments yet. Be the first!</p>
                        )}
                      </div>
                    </div>
                    

                    {/* COMMENT KRNE KA INPUT  */}
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
      </div>
    </div>
  );
};

export default MemeFeed;