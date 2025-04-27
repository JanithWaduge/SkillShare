import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

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
      await axios.post('http://localhost:8081/api/posts', {
        ...newPost,
        mediaUrls: newPost.mediaUrls.filter(url => url && url.trim() !== ''), // Clean mediaUrls
      });
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
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="app-title">Talento</h1>

        {posts.length === 0 ? (
          <p className="no-posts">No posts available yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} onClick={() => openPost(post)} className="post-card">
              <div className="post-header">
                <div className="avatar">
                  {post.postedBy?.charAt(0)}
                </div>
                <div>
                  <p className="posted-by">{post.postedBy}</p>
                  <p className="post-date">{post.createdAt}</p>
                </div>
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-description">{post.description}</p>

              {/* 🎯 CATEGORY NOW DISPLAYED */}
              <p className="post-category">Category: {post.category || 'Uncategorized'}</p>
            </div>
          ))
        )}
      </div>

      <button className="floating-button" onClick={() => setShowForm(true)}>+</button>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">Create New Post</h2>
            <form onSubmit={handleSubmit} className="form">
              <input type="text" name="title" placeholder="Title" value={newPost.title} onChange={handleInputChange} required />
              <textarea name="description" placeholder="Description" value={newPost.description} onChange={handleInputChange} required />
              {[0, 1, 2].map((i) => (
                <input key={i} type="text" placeholder={`Media URL ${i + 1}`} value={newPost.mediaUrls[i] || ''} onChange={(e) => handleMediaChange(e, i)} />
              ))}

              {/* Dropdown for category */}
              <select
                name="category"
                value={newPost.category}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Business">Business</option>
                <option value="Travel">Travel</option>
              </select>

              <input type="text" name="postedBy" placeholder="Posted By" value={newPost.postedBy} onChange={handleInputChange} required />
              <input type="text" name="createdAt" placeholder="Created At (e.g., 2025-04-26)" value={newPost.createdAt} onChange={handleInputChange} required />

              <div className="form-buttons">
                <button type="submit" className="btn-primary">Submit</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPost && (
        <div className="modal-overlay">
          <div className="modal">
            {editMode ? (
              <>
                <input type="text" name="title" value={selectedPost.title} onChange={handleSelectedPostChange} />
                <textarea name="description" value={selectedPost.description} onChange={handleSelectedPostChange} />

                {/* Dropdown for editing category */}
                <select
                  name="category"
                  value={selectedPost.category}
                  onChange={handleSelectedPostChange}
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Business">Business</option>
                  <option value="Travel">Travel</option>
                </select>

                <input type="text" name="postedBy" value={selectedPost.postedBy} onChange={handleSelectedPostChange} />
                <input type="text" name="createdAt" value={selectedPost.createdAt} onChange={handleSelectedPostChange} />

                <div className="form-buttons">
                  <button onClick={saveEditedPost} className="btn-primary">Save</button>
                  <button onClick={() => setEditMode(false)} className="btn-secondary">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="modal-title">{selectedPost.title}</h2>
                <p className="post-description">{selectedPost.description}</p>
                <p className="post-details">Category: {selectedPost.category}</p>
                <p className="post-details">Posted By: {selectedPost.postedBy}</p>
                <p className="post-details">Created At: {selectedPost.createdAt}</p>

                <div className="form-buttons">
                  <button onClick={() => setEditMode(true)} className="btn-primary">Edit</button>
                  <button onClick={() => deletePost(selectedPost.id)} className="btn-danger">Delete</button>
                  <button onClick={closePost} className="btn-secondary">Close</button>
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
