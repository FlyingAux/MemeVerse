import React from "react";

const CommentsModal = ({ isOpen, onClose, meme }) => {
  if (!isOpen || !meme) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-purple-100 dark:bg-purple-300 z-50 p-4">
      
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 sm:top-6 sm:right-10 text-black dark:text-white text-4xl sm:text-6xl font-bold z-50"
      >
        ×
      </button>


      <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden w-full max-w-5xl h-[90%]">
        
    
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-200 dark:bg-gray-700">
          <div className="h-full w-full relative overflow-hidden">
            <img 
              src={meme.imageUrl} 
              alt={meme.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">{meme.title}</h3>
              <p className="text-gray-200 text-sm">by {meme.user}</p>
            </div>
          </div>
        </div>

 
        <div className="w-full bg-purple-200 dark:bg-purple-500 md:w-1/2 p-4 md:p-6 h-full overflow-y-auto overflow-x-hidden">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Comments on {meme.title} by {meme.user}
          </h2>

          {meme.comments && meme.comments.length > 0 ? (
            <ul className="space-y-3">
              {meme.comments.slice().reverse().map((comment, index) => (
                <li key={index} className="p-2 border-b border-black dark:border-white">
                  <span className="font-semibold text-gray-900 dark:text-gray-200">{comment.user}:</span> 
                  <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
