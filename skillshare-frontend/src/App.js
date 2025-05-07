import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    // POST request eka change karanna /upload endpoint ekata
    await axios.post('http://localhost:8081/api/posts/upload', {  // Correct endpoint
      title: newPost.title,
      description: newPost.description,
      category: newPost.category,
      postedBy: newPost.postedBy,
      createdAt: newPost.createdAt,
      mediaFiles: newPost.mediaUrls, // Sending the mediaUrls array to backend
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
    toast.success('✅ Post Created Successfully!');
  } catch (error) {
    console.error('Error creating post:', error);
    toast.error('❌ Failed to create post');
  }
};


  const openEditPost = (post) => {
    setSelectedPost(post);
    setEditMode(true);
  };

  const closeEdit = () => {
    setSelectedPost(null);
    setEditMode(false);
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/api/posts/${id}`);
      closeEdit();
      fetchPosts();
      toast.success('🗑️ Post Deleted Successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('❌ Failed to delete post');
    }
  };

  const saveEditedPost = async () => {
    try {
      await axios.put(`http://localhost:8081/api/posts/${selectedPost.id}`, selectedPost);
      closeEdit();
      fetchPosts();
      toast.success('✅ Post Updated Successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('❌ Failed to update post');
    }
  };

  const handleSelectedPostChange = (e) => {
    const { name, value } = e.target;
    setSelectedPost((prev) => ({ ...prev, [name]: value }));
  };

  const likePost = async (id) => {
    try {
      await axios.put(`http://localhost:8081/api/posts/${id}/like`);
      fetchPosts();
      toast.success('❤️ Liked!');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('❌ Failed to like');
    }
  };

  const addComment = async (id, comment) => {
    try {
      await axios.put(`http://localhost:8081/api/posts/${id}/comment`, comment, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      fetchPosts();
      toast.success('💬 Comment Added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('❌ Failed to add comment');
    }
  };

  const deleteComment = async (postId, commentIndex) => {
    try {
      await axios.delete(`http://localhost:8081/api/posts/${postId}/comment/${commentIndex}/delete`);
      fetchPosts();
      toast.success('🗑️ Comment Deleted!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('❌ Failed to delete comment');
    }
  };

  return (
    <div className="app-container">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="content-wrapper">
        <h1 className="app-title">Talento</h1>

        {posts.length === 0 ? (
          <p className="no-posts">No posts available yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="avatar">
                  {post.postedBy?.charAt(0)}
                </div>
                <div>
                  <p className="posted-by">{post.postedBy}</p>
                  <p className="post-date">{post.createdAt}</p>
                </div>
                <div className="edit-icon" onClick={() => openEditPost(post)}>
                  ✏️
                </div>
              </div>
              <h2 className="post-title">{post.title}</h2>
              <p className="post-description">{post.description}</p>
              <p className="post-category">Category: {post.category || 'Uncategorized'}</p>

              {/* ❤️ Like button */}
              <button
                className={`like-button ${post.likes > 0 ? 'liked' : ''}`}
                onClick={() => likePost(post.id)}
              >
                ❤️ {post.likes || 0} Likes
              </button>

              {/* 💬 Comments Section */}
              <div className="comments-section">
                <h4>Comments</h4>
                {post.comments && post.comments.map((comment, index) => (
                  <p key={index} className="comment">
                    {comment}
                    <span
                      className="delete-comment-icon"
                      onClick={() => deleteComment(post.id, index)}
                    >
                      🗑️
                    </span>
                  </p>
                ))}
                {/* Add Comment Form */}
                <AddCommentForm postId={post.id} addComment={addComment} />
              </div>
            </div>
          ))
        )}
      </div>

      <button className="floating-button" onClick={() => setShowForm(true)}>+</button>

      {/* Create Post Modal */}
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
              <select name="category" value={newPost.category} onChange={handleInputChange} required>
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

      {/* Edit Post Modal */}
      {editMode && selectedPost && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-title">Edit Post</h2>
            <form className="form" onSubmit={(e) => { e.preventDefault(); saveEditedPost(); }}>
              <input type="text" name="title" placeholder="Title" value={selectedPost.title} onChange={handleSelectedPostChange} required />
              <textarea name="description" placeholder="Description" value={selectedPost.description} onChange={handleSelectedPostChange} required />
              <select name="category" value={selectedPost.category} onChange={handleSelectedPostChange} required>
                <option value="" disabled>Select Category</option>
                <option value="Technology">Technology</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Business">Business</option>
                <option value="Travel">Travel</option>
              </select>
              <input type="text" name="postedBy" placeholder="Posted By" value={selectedPost.postedBy} onChange={handleSelectedPostChange} required />
              <input type="text" name="createdAt" placeholder="Created At" value={selectedPost.createdAt} onChange={handleSelectedPostChange} required />
              <div className="form-buttons">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" onClick={() => deletePost(selectedPost.id)} className="btn-danger">Delete</button>
                <button type="button" onClick={closeEdit} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AddCommentForm({ postId, addComment }) {
  const [comment, setComment] = useState('');

  const submitComment = async (e) => {
    e.preventDefault();
    if (comment.trim() === '') return;
    await addComment(postId, comment);
    setComment('');
  };

  return (
    <form onSubmit={submitComment} className="add-comment-form">
      <input
        type="text"
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" className="btn-primary">Post</button>
    </form>
  );
}

export default App;
