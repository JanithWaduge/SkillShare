import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    mediaUrls: [],
    category: '',
    postedBy: '',
    createdAt: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e, index) => {
    const updatedUrls = [...newPost.mediaUrls];
    updatedUrls[index] = e.target.value;
    setNewPost((prev) => ({ ...prev, mediaUrls: updatedUrls }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/api/posts', newPost);
      setShowForm(false);
      setNewPost({
        title: '',
        description: '',
        mediaUrls: [],
        category: '',
        postedBy: '',
        createdAt: '',
      });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const openPost = (post) => {
    setSelectedPost(post);
    setEditMode(false);
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/posts/${id}`);
      closePost();
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const saveEditedPost = async () => {
    try {
      await axios.put(`http://localhost:8081/api/posts/${selectedPost.id}`, selectedPost);
      setEditMode(false);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleSelectedPostChange = (e) => {
    const { name, value } = e.target;
    setSelectedPost((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 relative">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Talento</h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-600">No posts available yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} onClick={() => openPost(post)} className="bg-white rounded-lg shadow-md p-5 mb-6 cursor-pointer hover:shadow-lg transition">
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
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-16 h-16 text-3xl flex items-center justify-center shadow-lg hover:bg-blue-700"
        onClick={() => setShowForm(true)}
      >
        +
      </button>

      {/* Add Post Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Create New Post</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="text" name="title" placeholder="Title" value={newPost.title} onChange={handleInputChange} required className="border rounded p-2" />
              <textarea name="description" placeholder="Description" value={newPost.description} onChange={handleInputChange} required className="border rounded p-2" />
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Media URL ${i + 1}`}
                  value={newPost.mediaUrls[i] || ''}
                  onChange={(e) => handleMediaChange(e, i)}
                  className="border rounded p-2"
                />
              ))}
              <input type="text" name="category" placeholder="Category" value={newPost.category} onChange={handleInputChange} required className="border rounded p-2" />
              <input type="text" name="postedBy" placeholder="Posted By" value={newPost.postedBy} onChange={handleInputChange} required className="border rounded p-2" />
              <input type="text" name="createdAt" placeholder="Created At (e.g., 2025-04-26)" value={newPost.createdAt} onChange={handleInputChange} required className="border rounded p-2" />

              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Submit
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Post Full View */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            {editMode ? (
              <>
                <input type="text" name="title" value={selectedPost.title} onChange={handleSelectedPostChange} className="border rounded p-2 w-full mb-2" />
                <textarea name="description" value={selectedPost.description} onChange={handleSelectedPostChange} className="border rounded p-2 w-full mb-2" />
                <input type="text" name="category" value={selectedPost.category} onChange={handleSelectedPostChange} className="border rounded p-2 w-full mb-2" />
                <input type="text" name="postedBy" value={selectedPost.postedBy} onChange={handleSelectedPostChange} className="border rounded p-2 w-full mb-2" />
                <input type="text" name="createdAt" value={selectedPost.createdAt} onChange={handleSelectedPostChange} className="border rounded p-2 w-full mb-2" />

                <div className="flex gap-3 mt-4">
                  <button onClick={saveEditedPost} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Save
                  </button>
                  <button onClick={() => setEditMode(false)} className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
                <p className="text-gray-700 mb-4">{selectedPost.description}</p>
                <p className="text-sm text-gray-400 mb-2">Category: {selectedPost.category}</p>
                <p className="text-sm text-gray-400 mb-2">Posted By: {selectedPost.postedBy}</p>
                <p className="text-sm text-gray-400 mb-4">Created At: {selectedPost.createdAt}</p>

                <div className="flex gap-3">
                  <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Edit
                  </button>
                  <button onClick={() => deletePost(selectedPost.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    Delete
                  </button>
                  <button onClick={closePost} className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500">
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
