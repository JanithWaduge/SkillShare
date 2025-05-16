import React, { useEffect, useState } from 'react';
import './ViewAllTutorialsAdmin.css';
import axios from 'axios';

const ViewAllTutorials = () => {
  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/api/tutorials')
      .then(response => {
        setTutorials(response.data);
      })
      .catch(error => {
        console.error('Error fetching tutorials:', error);
      });
  }, []);

  const handleEdit = (id) => {
    alert(`Edit tutorial ${id}`);
    // You can navigate to edit page here
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete tutorial ${id}?`)) {
      axios.delete(`http://localhost:8081/api/tutorials/${id}`)
        .then(() => {
          alert(`Tutorial ${id} deleted`);
          setTutorials(prev => prev.filter(t => t._id !== id && t.id !== id));
        })
        .catch(error => {
          console.error('Delete failed:', error);
          alert('Failed to delete tutorial');
        });
    }
  };

  return (
    <div className="tutorials-container">
      <h2>All Tutorials</h2>

      <table className="tutorials-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Duration</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tutorials.map((tut) => (
            <tr key={tut._id || tut.id}>
              <td>{tut.title}</td>
              <td>{tut.category}</td>
              <td>{tut.estimatedCompletionTime}</td>
              <td>{tut.createdBy}</td>
              <td>{tut.createdAt?.substring(0, 10)}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(tut._id || tut.id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(tut._id || tut.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAllTutorials;
