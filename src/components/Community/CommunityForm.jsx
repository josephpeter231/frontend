import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommunityForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [communityId, setCommunityId] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [userids, setUserids] = useState('');

    const token = localStorage.getItem('token');
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        console.log(storedUser)
        if (storedUser) {
          
          setUserids(storedUser._id);
        }
      }, []);
      console.log(users.users)
      

    // Create a community
    const handleCommunityCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/community/create', 
                { name, description ,userids}
                
            );
            setCommunityId(res.data._id);
            setMessage('Community created successfully');
        } catch (err) {
            setMessage(err.response ? err.response.data.error : 'An error occurred');
        }
    };

    // Send a message or upload a file
    const handleSendMessage = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (text) formData.append('text', text);
        if (file) formData.append('file', file);

        try {
            await axios.post(`http://localhost:5000/api/community/${communityId}/message`, 
                formData, 
             
            );
            setMessage('Message sent successfully!');
            setText('');
            setFile(null);
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'An error occurred');
        }
    };

    // Fetch all registered users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users', );
                setUsers(res.data);
                console.log(res.data)
            } catch (err) {
                console.error('Error fetching users', err);
            }
        };
        fetchUsers();
    }, [token]);

    // Add a user to the community
    const handleAddMember = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/api/community/${communityId}/add-member`, 
                { userId: selectedUser }, 
                
            );
            setMessage('User added to community');
        } catch (err) {
            setMessage(err.response ? err.response.data.error : 'An error occurred');
        }
    };

    return (
        <div>
            {/* Create Community Form */}
            <form onSubmit={handleCommunityCreate}>
                <div className="mb-3">
                    <label className="form-label">Community Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Community</button>
            </form>

            {/* Send Message and File Form */}
            {communityId && (
                <div className="mt-4">
                    <h4>Send Message or File to Community</h4>
                    <form onSubmit={handleSendMessage}>
                        <div className="mb-3">
                            <label className="form-label">Message</label>
                            <input
                                type="text"
                                className="form-control"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">File</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>
                        <button type="submit" className="btn btn-success">Send</button>
                    </form>
                </div>
            )}

            {/* Add User to Community */}
            {communityId && (
                <div className="mt-4">
                    <h4>Add Users to Community</h4>
                    <form onSubmit={handleAddMember}>
                        <div className="mb-3">
                            <label className="form-label">Select User</label>
                            <select
                                className="form-control"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                required
                            >
                                <option value="">Select a user</option>
                                {users.users.map((user) => (
                                    <option key={user._id} value={user._id}>{user.email}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-info">Add User</button>
                    </form>
                </div>
            )}

            {/* Display message */}
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
};

export default CommunityForm;
