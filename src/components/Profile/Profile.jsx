import React, { useEffect, useState } from 'react';
import Navbar from '../User/Navbar';

function Profile() {
  const [user, setUser] = useState({ email: '', imageUrl: '', bio: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newBio, setNewBio] = useState('');
  const [userid, setUserid] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      setNewEmail(storedUser.email);
      setNewImageUrl(storedUser.imageUrl);
      setNewBio(storedUser.bio);
      setUserid(storedUser.userid);
    }
  }, []);

  const handleSave = async () => {
    const updatedUser = { email: newEmail, imageUrl: newImageUrl, bio: newBio };

    try {
      const response = await fetch(`http://localhost:5000/user/${userid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg text-center">
              <div className="card-body">
                <h2 className="mb-4">User Profile</h2>

                {isEditing ? (
                  <>
                    <div className="form-group mb-3">
                      <label>Profile Image URL</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label>Bio</label>
                      <textarea
                        className="form-control"
                        value={newBio}
                        onChange={(e) => setNewBio(e.target.value)}
                      />
                    </div>

                    <button className="btn btn-success" onClick={handleSave}>
                      Save Changes
                    </button>
                    <button
                      className="btn btn-secondary ml-2"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-3">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt="Profile"
                          className="img-fluid rounded-circle ml-[190px]"
                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="mb-3" style={{ width: '150px', height: '150px', backgroundColor: '#f0f0f0', borderRadius: '50%' }}>
                          <p className="text-center" style={{ lineHeight: '150px', color: '#888' }}>No Image</p>
                        </div>
                      )}
                    </div>

                    <h4>{user.email ? user.email : 'No email available'}</h4>
                    <p>{user.bio ? user.bio : 'No bio available'}</p>

                    <button
                      className="btn btn-primary mt-4"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>

                    <button
                      className="btn btn-danger mt-4 ml-2"
                      onClick={() => {
                        localStorage.removeItem('user');
                        alert('User logged out');
                        window.location.href = '/';
                        setUser({ email: '', imageUrl: '', bio: '' });
                      }}
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
