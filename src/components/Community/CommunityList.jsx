import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../User/Navbar'
const CommunityList = () => {
    const [communities, setCommunities] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userid = storedUser.userid;

    const fetchCommunities = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/community');
            setCommunities(res.data);
        } catch (err) {
            console.error('Error fetching communities', err);
        }
    };

    const handleCommunityCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/community/create', { name, description, userid });
            setMessage('Community created successfully');
            setName('');
            setDescription('');
            fetchCommunities();
        } catch (err) {
            setMessage(err.response ? err.response.data.error : 'An error occurred');
        }
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    const handleViewChat = (communityId) => {
        navigate(`/community/${communityId}`);
    };

    return (
        <>
        <Navbar />
        <div className="container mx-auto p-4">
            {/* Create Community Form */}
            <h2 className="text-2xl font-bold mb-4">Create a New Community</h2>
            <form onSubmit={handleCommunityCreate} className="bg-white p-4 rounded-lg shadow-md">
                <div className="mb-3">
                    <label className="form-label">Community Name</label>
                    <input
                        type="text"
                        className="form-control border rounded p-2 w-full"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control border rounded p-2 w-full"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                    Create Community
                </button>
            </form>

            {/* Community List */}
            <h2 className="text-xl font-semibold mt-6">Your Communities</h2>
            <ul className="list-group mt-4">
                {communities.map((community) => (
                    <li key={community._id} className="list-group-item p-4 bg-gray-100 rounded-lg shadow mb-2">
                        <h5 className="font-bold text-lg">{community.name}</h5>
                        <p className="text-gray-600">{community.description}</p>
                        <button
                            className="btn btn-link text-blue-600 hover:underline mt-2"
                            onClick={() => handleViewChat(community._id)}
                        >
                            View Chat
                        </button>
                    </li>
                ))}
            </ul>

            {/* Display message */}
            {message && <div className="alert alert-info mt-3 text-green-600">{message}</div>}
        </div>
        </>
    );
};

export default CommunityList;
