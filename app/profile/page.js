"use client";
import React, { useState, useEffect } from "react";
import { getMemes } from "../utils/indexedDB";

const Profile = () => {
  // State to store the user's uploaded memes
  const [userMemes, setUserMemes] = useState([]);

  // Retrieve logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    // Fetch memes uploaded by the logged-in user
    const fetchUserMemes = async () => {
      if (!user) return; // Stop if no user is logged in

      const allMemes = await getMemes(); // Retrieve all memes from IndexedDB
      const filteredMemes = allMemes.filter((meme) => meme.user === user.username); // Filter memes by user
      setUserMemes(filteredMemes);
    };

    fetchUserMemes();
  }, []); // Runs once when the component mounts

  // If no user is logged in, display a message
  if (!user) {
    return <h2 className="text-center text-2xl">Please log in to view your profile.</h2>;
  }

  return (
    <div className="py-20">
      {/* Display logged-in user's profile */}
      <h2 className="text-2xl font-bold">Profile: {user.username}</h2>

      {/* Section for uploaded memes */}
      <h2 className="text-xl font-bold mt-5">Your Uploaded Memes</h2>
      {userMemes.length === 0 ? (
        <p className="text-gray-500">You haven’t uploaded any memes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userMemes.map((meme) => (
            <div key={meme.id} className="border p-4 rounded-md shadow-lg">
              {/* Meme Image */}
              <img src={meme.imageUrl} alt={meme.title} className="w-full rounded-md" />
              
              {/* Meme Title */}
              <h3 className="text-lg font-semibold mt-2">{meme.title}</h3>
              
              {/* Like Count */}
              <p className="text-gray-600">Likes: {meme.likes}</p>

              {/* Display Comments Section */}
              <div className="mt-2">
                <h4 className="font-bold">Comments:</h4>
                {meme.comments && meme.comments.length > 0 ? (
                  <ul className="list-disc pl-4 text-gray-700">
                    {meme.comments.map((comment, index) => (
                      <li key={index}>{comment}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
