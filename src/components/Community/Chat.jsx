import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CommunityChat.css'; 
import Navbar from '../User/Navbar'

const CommunityChat = () => {
    const { id: communityId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [viewParticipantsModalIsOpen, setViewParticipantsModalIsOpen] = useState(false); 

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUserId(storedUser.userid);
        }

        fetchMessages();
        fetchUsers();
        fetchParticipants();
    }, [communityId]);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/community/${communityId}/messages`);
            setMessages(res.data || []);
        } catch (err) {
            console.error('Error fetching messages', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data.users || []);
        } catch (err) {
            console.error('Error fetching users', err);
        }
    };

    const fetchParticipants = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/${communityId}/participants`);
            setParticipants(res.data || []);
        } catch (err) {
            console.error('Error fetching participants', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const messageData = {
            sender: userId,
            type: selectedFile ? 'file' : 'text',
            text: newMessage || null,
            fileUrl: selectedFile ? await uploadFile(selectedFile) : null
        };

        try {
            await axios.post(`http://localhost:5000/api/community/${communityId}/messages`, messageData, {
                headers: { 'Content-Type': 'application/json' },
            });

            setNewMessage('');
            setSelectedFile(null);
            fetchMessages();
        } catch (err) {
            console.error('Error sending message', err);
        }
    };

    const uploadFile = async (file) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = async () => {
                const base64String = reader.result.split(',')[1];
                const messageData = {
                    fileName: file.name,
                    fileType: file.type,
                    file: base64String,
                };

                try {
                    const response = await axios.post('http://localhost:5000/api/upload', messageData, {
                        headers: { 'Content-Type': 'application/json' },
                    });
                    resolve(response.data.fileUrl);
                } catch (err) {
                    console.error('Error uploading file', err);
                    reject(null);
                }
            };

            reader.onerror = (error) => {
                console.error('Error reading file', error);
                reject(null);
            };

            reader.readAsDataURL(file);
        });
    };

    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };

    const toggleViewParticipantsModal = () => {
        setViewParticipantsModalIsOpen(!viewParticipantsModalIsOpen);
    };

    const handleAddParticipant = async (user) => {
        try {
            await axios.patch(`http://localhost:5000/community/${communityId}/members`, { userId: user._id });
            setParticipants([...participants, user]);
        } catch (err) {
            console.error('Error adding participant', err);
        }
    };

    const handleRemoveParticipant = async (user) => {
        try {
            await axios.delete(`http://localhost:5000/api/community/${communityId}/participants/${user._id}`);
            setParticipants(participants.filter((participant) => participant._id !== user._id));
        } catch (err) {
            console.error('Error removing participant', err);
        }
    };

    return (
        <>
        <Navbar />
        <div className="chat-container">
            <h2 className="text-xl font-bold">Community Chat</h2>
            <button className="btn btn-secondary" onClick={toggleModal}>
                Add People
            </button>
            <button className="btn btn-secondary" onClick={toggleViewParticipantsModal}> 
                View People
            </button>
            <div className="message-list">
                {messages.length === 0 ? (
                    <p>No messages to display.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg._id} className={`message-item ${msg.sender._id === userId ? 'my-message' : ''}`}>
                            {msg.type === 'text' ? (
                                <p>{msg.text}</p>
                            ) : (
                                <p>File: {msg.fileUrl}</p>
                            )}
                            <small>From: {msg.sender.email}</small>
                            <small>Sent at: {new Date(msg.createdAt).toLocaleString()}</small>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSendMessage} className="message-form">
                <div className="mb-3">
                    <label className="form-label">Message</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={selectedFile !== null}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Attach File</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {selectedFile ? 'Send File' : 'Send Message'}
                </button>
            </form>

            {/* Add People Modal */}
            {modalIsOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-5 w-1/2">
                        <h2 className="text-lg font-bold mb-4">Add People to Community</h2>
                        <button onClick={toggleModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">✖</button>
                        <div className="user-list">
                            {users.map((user) => (
                                <div key={user._id} className="flex justify-between items-center py-2 border-b">
                                    <span>{user.email}</span>
                                    {participants.find((p) => p._id === user._id) ? (
                                        <button onClick={() => handleRemoveParticipant(user)} className="btn btn-danger">Remove</button>
                                    ) : (
                                        <button onClick={() => handleAddParticipant(user)} className="btn btn-success">Add</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* View Participants Modal */}
            {viewParticipantsModalIsOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-5 w-1/2">
                        <h2 className="text-lg font-bold mb-4">Participants in Community</h2>
                        <button onClick={toggleViewParticipantsModal} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">✖</button>
                        <div className="participant-list">
                            {participants.map((participant) => (
                                <div key={participant._id} className="flex justify-between items-center py-2 border-b">
                                    <span>{participant.email}</span>
                                    <button onClick={() => handleRemoveParticipant(participant)} className="btn btn-danger">Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default CommunityChat;
