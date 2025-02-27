"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMemes, updateMeme } from "../utils/indexedDB";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import InfiniteScroll from "react-infinite-scroll-component";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";
import { TbBrandFeedly } from "react-icons/tb";

const MemeFeed = () => {
  const router = useRouter();
  const [memes, setMemes] = useState([]);
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [commentMap, setCommentMap] = useState({});
  const [likedMemes, setLikedMemes] = useState({});
  const [user, setUser] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const memesPerPage = 6;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser) {
      router.push("/");
      return;
    }
    setUser(storedUser);

    const fetchMemes = async () => {
      const allMemes = await getMemes();
      setMemes(allMemes);
      applyFilters(allMemes);

      const userLikes = JSON.parse(localStorage.getItem(`likedMemes_${storedUser.username}`)) || {};
      setLikedMemes(userLikes);
    };

    fetchMemes();
  }, []);

  const applyFilters = (memesList) => {
    let filtered = [...memesList];

    if (category !== "All") {
      filtered = filtered.filter((meme) => meme.category === category);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((meme) =>
        meme.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "comments") return (b.comments?.length || 0) - (a.comments?.length || 0);
      return new Date(b.date) - new Date(a.date);
    });

    setFilteredMemes(filtered.slice(0, memesPerPage));
    setCurrentPage(1);
    setHasMore(filtered.length > memesPerPage);
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      setSearchQuery(query);
      applyFilters(memes);
    }, 500),
    [memes, category, sortBy]
  );

  const fetchMoreMemes = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * memesPerPage;
    const newMemes = memes.slice(0, startIndex + memesPerPage);

    setFilteredMemes(newMemes);
    setCurrentPage(nextPage);
    if (newMemes.length >= memes.length) {
      setHasMore(false);
    }
  };

  const handleLike = async (meme) => {
    if (!user || likedMemes[meme.id]) return;

    const memeId = meme.id;
    const updatedMemes = memes.map((m) =>
      m.id === memeId ? { ...m, likes: (m.likes || 0) + 1 } : m
    );
    setMemes(updatedMemes);
    applyFilters(updatedMemes);

    const updatedMeme = updatedMemes.find((m) => m.id === memeId);
    await updateMeme(updatedMeme);

    const updatedLikes = { ...likedMemes, [memeId]: true };
    setLikedMemes(updatedLikes);
    localStorage.setItem(`likedMemes_${user.username}`, JSON.stringify(updatedLikes));
  };

  const handleComment = async (memeId) => {
    if (!user || !commentMap[memeId]?.trim()) return;

    const newComment = { user: user.username, text: commentMap[memeId] };

    const updatedMemes = memes.map((m) =>
      m.id === memeId ? { ...m, comments: [...(m.comments || []), newComment] } : m
    );

    setMemes(updatedMemes);
    applyFilters(updatedMemes);
    setCommentMap((prev) => ({ ...prev, [memeId]: "" }));

    const updatedMeme = updatedMemes.find((m) => m.id === memeId);
    await updateMeme(updatedMeme);
  };

  return (
    <div className="py-24">
      <h2 className="text-4xl text-blue-500 font-bold text-center mb-4 flex items-center justify-center gap-2"><TbBrandFeedly /> Meme Feed</h2>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Search memes..."
          onChange={(e) => debouncedSearch(e.target.value)}
          className="border p-2 rounded-md"
        />
        <select onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded-md">
          <option value="date">Sort by Date</option>
          <option value="likes">Sort by Likes</option>
          <option value="comments">Sort by Comments</option>
        </select>
        <select onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded-md">
          <option value="All">All</option>
          <option value="Trending">Trending</option>
          <option value="New">New</option>
          <option value="Classic">Classic</option>
          <option value="Random">Random</option>
        </select>
      </div>

      <InfiniteScroll
        dataLength={filteredMemes.length}
        next={fetchMoreMemes}
        hasMore={hasMore}
        loader={<p className="text-center">Loading more memes...</p>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-6">
          {filteredMemes.map((meme) => (
            <motion.div
              key={meme.id}
              className="border p-4 rounded-md shadow-lg bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={meme.imageUrl} alt={meme.title} className="w-full h-96 object-cover rounded-md" />
              <h3 className="text-lg font-semibold mt-2">{meme.title}</h3>
              <p className="text-gray-600">Uploaded by: {meme.user}</p>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => handleLike(meme)}
                  className={likedMemes[meme.id] ? "text-red-500 text-2xl" : "text-gray-500 text-2xl"}
                >
                  {likedMemes[meme.id] ? <FaHeart /> : <FaRegHeart />}
                </button>
                <span>{meme.likes || 0}</span>
              </div>

              <div className="mt-3">
                <h4 className="font-bold">Comments:</h4>
                <div className="max-h-20 overflow-y-auto border p-2 rounded-md">
                  {meme.comments && meme.comments.length > 0 ? (
                    <ul className="text-gray-700">
                      {meme.comments.map((comment, index) => (
                        <li key={index} className="border-b pb-1 mb-1">
                          <strong>{comment.user}:</strong> {comment.text}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No comments yet.</p>
                  )}
                </div>
              </div>

              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={commentMap[meme.id] || ""}
                  onChange={(e) => setCommentMap({ ...commentMap, [meme.id]: e.target.value })}
                  placeholder="Write a comment..."
                  className="border p-2 rounded-md flex-1"
                />
                <button onClick={() => handleComment(meme.id)} className="text-green-500 text-xl">
                  <IoMdSend />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default MemeFeed;