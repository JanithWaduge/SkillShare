import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './UserManagement.css';

const API_URL = 'http://localhost:8081/api/users';

function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formMode, setFormMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    skills: '',
    profileImageUrl: '',
    createdAt: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('❌ Failed to fetch users');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim())
    };

    try {
      if (formMode === 'create') {
        await axios.post(API_URL, payload);
        toast.success('✅ User successfully created!');
        setTimeout(() => {
          navigate('/posts'); // Redirect to posts
        }, 1500);
      } else {
        await axios.put(`${API_URL}/${selectedUser.id}`, payload);
        toast.success('User successfully updated!');
        fetchUsers();
      }

      setFormData({
        name: '',
        email: '',
        password: '',
        bio: '',
        skills: '',
        profileImageUrl: '',
        createdAt: ''
      });
      setFormMode('create');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('❌ Failed to create or update user');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      bio: user.bio,
      skills: user.skills.join(', '),
      profileImageUrl: user.profileImageUrl,
      createdAt: user.createdAt
    });
    setFormMode('edit');
    setSelectedUser(user);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
      toast.success('🗑️ User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('❌ Failed to delete user');
    }
  };

  return (
    <div className="user-mgmt-container">
      <h1 className="system-title">Talento</h1>
      <h2>👤 User Management</h2>

      <form onSubmit={handleSubmit} className="user-form">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          required
        />
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Bio"
        />
        <input
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
        />
        <input
          name="profileImageUrl"
          value={formData.profileImageUrl}
          onChange={handleChange}
          placeholder="Profile Image URL"
        />
        <input
          name="createdAt"
          value={formData.createdAt}
          onChange={handleChange}
          placeholder="Created At (e.g., 2025-04-27)"
        />
        <button type="submit">{formMode === 'create' ? 'Create' : 'Update'} User</button>
      </form>

      <div className="user-list">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <img
              src={user.profileImageUrl || 'https://via.placeholder.com/100'}
              alt="Profile"
            />
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Bio:</strong> {user.bio}</p>
            <p><strong>Skills:</strong> {user.skills.join(', ')}</p>
            <p><strong>Joined:</strong> {user.createdAt}</p>
            <div className="user-actions">
              <button onClick={() => handleEdit(user)}>✏️ Edit</button>
              <button onClick={() => handleDelete(user.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
}

export default UserManagement;
