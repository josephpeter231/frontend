import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/register', { email, password, imageUrl });
      
      // Store user data in local storage
      const userData = { email, imageUrl };
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log(imageUrl);
      alert('User registered successfully');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="text-center mb-4">Register</h2>

              <div className="form-group mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group mb-3">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group mb-4">
                <label>Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter image URL"
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <button className="btn btn-primary btn-block" onClick={handleRegister}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
