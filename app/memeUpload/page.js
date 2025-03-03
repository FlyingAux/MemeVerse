"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addMeme } from "../utils/indexedDB";
import LoginModal from "../utils/LoginModal";
import { motion } from "framer-motion";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import OpenAI from "openai";

const UploadMeme = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [memeTemplates, setMemeTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("loggedInUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        toast.info("🚀 Please log in to upload memes!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
  
        setTimeout(() => {
          router.push("/");
        }, 2000); 
        return;
      }
    }
  }, []);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        if (data.success) {
          setMemeTemplates(data.data.memes.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching meme templates:", error);
      }
    };
    fetchTemplates();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setIsConfirmed(false);
      setSelectedTemplate(null);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setImagePreview(template.url);
    setImage(null);
    setTopText("");
    setBottomText("");
    setIsConfirmed(false);
  };

  const handleConfirm = () => {
    if (!title.trim()) {
      toast.error("Please provide a title for your meme!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!imagePreview) {
      toast.error("Please select a template or upload an image!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setIsConfirmed(true);
    toast.success("Meme confirmed! You can now upload.", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });
  };

  const generateCaption = async () => {
    if (!imagePreview) {
      toast.info("Please upload or select an image first!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setGeneratingCaption(true);
    
    try {
      const templateName = selectedTemplate?.name || "Custom";
      const captions = [
        `When ${templateName} hits just right`,
        `That ${templateName} moment`,
        `Nobody: | Me with ${templateName}:`,
        `${templateName} energy intensifies`,
        `${templateName}: Unlocked`,
        `POV: You just discovered ${templateName}`,
        `My face when ${templateName}`,
        `${templateName} has entered the chat`,
        `Living that ${templateName} life`,
        `${templateName}: Level 100`,
        `Plot twist: It was ${templateName} all along`,
        `${templateName} is my spirit animal`,
        `${templateName} - nailed it!`,
        `Just ${templateName} things`,
        `${templateName} mode: activated`
      ];

      setTimeout(() => {
    
        const randomCaption = captions[Math.floor(Math.random() * captions.length)];
        setTitle(randomCaption);
        
        toast.success("Caption generated successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        setGeneratingCaption(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error generating caption:", error);
      toast.error("Failed to generate caption. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      setGeneratingCaption(false);
    }
  };

  const uploadImage = async () => {
    if (!title.trim()) {
      toast.error("Please provide a title for your meme!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!imagePreview) {
      toast.error("Please select a template or upload an image!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    if (!isConfirmed) {
      toast.info("Please confirm before uploading!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setLoading(true);
    let imageUrl = imagePreview;

    if (image) {
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
          imageUrl = data.data.url;
        } else {
          toast.error("Failed to Upload!", {
            position: "top-right",
            autoClose: 2000, 
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          });
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to Upload!", {
          position: "top-right",
          autoClose: 2000, 
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        setLoading(false);
        return;
      }
    }

    const newMeme = {
      id: Date.now(),
      title,
      imageUrl,
      user: user.username,
      likes: 0,
      comments: [],
      date: new Date().toISOString(),
    };

    await addMeme(newMeme);
    setTitle("");
    setImage(null);
    setImagePreview(null);
    setSelectedTemplate(null);
    setIsConfirmed(false);
    
    toast.success("Meme uploaded successfully!!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });
    
    setTimeout(() => {
      router.push("/profile");
    }, 2000);
    
    setLoading(false);
  };

  return (
    <div className="py-8 sm:py-16 md:py-24 flex flex-col items-center w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 bg-purple-100 dark:bg-purple-400 shadow-xl rounded-xl border border-slate-200 dark:border-purple-400">
      <ToastContainer />
      <motion.h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-purple-500 dark:text-white text-center">Upload or Generate Meme</motion.h2>
      
      {user ? (
        <>
          <div className="w-full flex flex-col sm:flex-row items-center gap-2 mb-4">
            <motion.input
              type="text"
              placeholder="Meme Title (required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-white dark:text-black mb-2 sm:mb-0"
            />
            <motion.button
              onClick={generateCaption}
              disabled={generatingCaption || !imagePreview}
              className={`w-full sm:w-auto px-3 py-2 sm:py-3 ${generatingCaption || !imagePreview ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"} text-white rounded-lg transition-all whitespace-nowrap`}
            >
              {generatingCaption ? "Generating..." : "AI Caption"}
            </motion.button>
          </div>

          <div className="w-full mb-4">
            <p className="text-sm mb-2 text-gray-700 dark:text-white font-medium">Choose one option below:</p>
            <div className="bg-white dark:bg-purple-500 p-3 rounded-lg">
              <p className="text-base font-medium mb-2 text-black dark:text-white">Upload your own image</p>
              <motion.input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={!!selectedTemplate}
                className={`w-full p-2 border ${selectedTemplate ? "bg-gray-200 cursor-not-allowed" : "border-black dark:border-white"} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm`}
              />
              {selectedTemplate && (
                <p className="text-xs text-red-500 mt-1">Please deselect template first to upload your image</p>
              )}
            </div>
          </div>

          <div className="w-full mb-4">
            <div className="bg-white dark:bg-purple-500 p-3 rounded-lg">
              <p className="text-base font-medium mb-2 text-black dark:text-white">Choose a template</p>
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mt-2 sm:mt-3 w-full"
              >
                {memeTemplates.map((template) => (
                  <motion.div key={template.id} className="relative">
                    <motion.img
                      src={template.url}
                      alt={template.name}
                      className={`w-full h-16 sm:h-20 md:h-24 rounded-lg object-cover cursor-pointer border-2 
                        ${selectedTemplate?.id === template.id ? "border-blue-500" : "border-gray-300"}
                        ${image ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => !image && handleTemplateSelect(template)}
                    />
                    {selectedTemplate?.id === template.id && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
              {image && (
                <p className="text-xs text-red-500 mt-1">Please clear your uploaded image first to select a template</p>
              )}
            </div>
          </div>
          
          {imagePreview && (
            <div className="flex flex-col items-center mt-4 sm:mt-6 w-full">
              <h3 className="text-lg font-semibold mb-2">Preview:</h3>
              <motion.img 
                src={imagePreview} 
                alt="Preview" 
                className="w-48 sm:w-64 rounded-lg shadow-md border border-gray-300 object-contain" 
              />
              {(image || selectedTemplate) && (
                <button 
                  onClick={() => {
                    setImage(null);
                    setSelectedTemplate(null);
                    setImagePreview(null);
                    setIsConfirmed(false);
                  }}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                >
                  Clear Selection
                </button>
              )}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6 w-full sm:w-auto">
            <motion.button 
              onClick={handleConfirm} 
              disabled={!imagePreview || !title.trim()}
              className={`px-4 sm:px-6 py-2 sm:py-3 ${!imagePreview || !title.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"} text-white rounded-lg transition-all w-full sm:w-auto text-sm sm:text-base`}
            >
              Confirm
            </motion.button>
            <motion.button 
              onClick={uploadImage} 
              disabled={!isConfirmed} 
              className={`px-4 sm:px-6 py-2 sm:py-3 ${isConfirmed ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"} text-white rounded-lg transition-all w-full sm:w-auto text-sm sm:text-base`}
            >
              {loading ? "Uploading..." : "Upload Meme"}
            </motion.button>
          </div>
        </>
      ) : (
        <motion.p className="text-red-500 text-center">Please log in to upload memes.</motion.p>
      )}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default UploadMeme;