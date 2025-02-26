"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addMeme } from "../utils/indexedDB";
import LoginModal from "../components/LoginModal"; // Import Login Modal

const UploadMeme = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false); // Control modal visibility
  const router = useRouter();

  // Fetch logged-in user from localStorage (Client-Side Only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("loggedInUser");
      console.log("Stored User:", storedUser); // Debugging

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setShowLoginModal(true); // Show login modal if user is not logged in
      }
    }
  }, []);

  const uploadImage = async () => {
    if (!user) {
      alert("You must be logged in to upload memes!");
      setShowLoginModal(true); // Show login modal if not logged in
      return;
    }
    if (!image || !title) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("key", process.env.NEXT_PUBLIC_IMGBB_API_KEY);

    try {
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const newMeme = {
          id: Date.now(),
          title,
          imageUrl: data.data.url,
          user: user.username,
          likes: 0,
          comments: [],
          date: new Date().toISOString(),
        };

        await addMeme(newMeme);

        // Clear input fields
        setTitle("");
        setImage(null);

        alert("Meme uploaded successfully!");
        router.push("/profile");
      } else {
        alert("Failed to upload meme");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading meme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20">
      <h2 className="text-2xl font-bold">Upload Meme</h2>
      {user ? (
        <>
          <input
            type="text"
            placeholder="Meme Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 my-2 w-full"
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="border p-2 my-2 w-full"
          />
          <button
            onClick={uploadImage}
            className="bg-blue-500 text-white px-4 py-2 mt-2"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Meme"}
          </button>
        </>
      ) : (
        <p className="text-red-500">Please log in to upload memes.</p>
      )}

      {/* Show Login Modal when user is not logged in */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default UploadMeme;
