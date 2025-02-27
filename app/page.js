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

    setMemes((prevMemes) => {
      const updatedMemes = prevMemes.map((meme) =>
        meme.id === memeId ? { ...meme, likes: (meme.likes || 0) + 1 } : meme
      );

      const updatedMeme = updatedMemes.find((meme) => meme.id === memeId);
      if (updatedMeme) {
        updateMeme({ ...updatedMeme, likes: updatedMeme.likes });
      }

      return updatedMemes;
    });

    setLikedMemes((prev) => ({ ...prev, [memeId]: true }));
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
    <div className="py-24">
      <h2 className="text-4xl font-semibold text-center mb-8 text-blue-500">🔥 Trending Memes</h2>

      <InfiniteScroll
        dataLength={memes.length}
        next={fetchMoreMemes}
        hasMore={hasMore}
        loader={<motion.div className="text-center text-lg">Loading more memes...</motion.div>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8 px-5">
          {memes.map((meme) => (
            <motion.div
              key={meme.id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src={meme.imageUrl}
                alt={meme.title}
                className="w-full h-64 object-cover rounded-md mb-2 mt-2"
              />
              <h3 className="text-lg font-semibold text-gray-800">{meme.title}</h3>

           
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => handleLike(meme.id)}
                  className={likedMemes[meme.id] ? "text-red-500 text-2xl" : "text-gray-500 text-2xl"}
                >
                  {likedMemes[meme.id] ? <FaHeart /> : <FaRegHeart />}
                </button>
                <span>{meme.likes || 0}</span>
              </div>

            
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Comments:</h4>
                <div className="max-h-40 overflow-y-auto border rounded-md p-2 mb-2">
                  {meme.comments && meme.comments.length > 0 ? (
                    meme.comments.map((comment, index) => (
                      <p key={index} className="text-gray-700 text-sm mb-1">
                        <strong>{comment.user}:</strong> {comment.text}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  )}
                </div>

          
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentMap[meme.id] || ""}
                    onChange={(e) =>
                      setCommentMap({ ...commentMap, [meme.id]: e.target.value })
                    }
                    placeholder="Write a comment..."
                    className="border p-2 flex-1 rounded-md"
                  />
                  <button
                    onClick={() => handleComment(meme.id)}
                    className="text-green-500 text-2xl"
                  >
                    <IoMdSend />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Home;