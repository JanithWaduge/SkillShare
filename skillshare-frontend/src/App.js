import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Talento</h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-600">No posts available yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-5 mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg">
                  {post.postedBy?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{post.postedBy}</p>
                  <p className="text-gray-400 text-sm">{post.createdAt}</p>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.description}</p>

              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.mediaUrls.map((url, index) => (
                    <div key={index} className="w-full">
                      {url.endsWith('.mp4') ? (
                        <video src={url} controls className="rounded-lg w-full max-h-[400px] object-cover" />
                      ) : (
                        <img src={url} alt={`media-${index}`} className="rounded-lg w-full max-h-[400px] object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 text-gray-500 text-sm">
                <button className="hover:text-blue-500">👍 Like</button>
                <button className="hover:text-blue-500">💬 Comment</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
