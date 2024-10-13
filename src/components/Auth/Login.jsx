import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      
      // Store user data in local storage
      console.log(res.data.userId)
      const userData = { email, imageUrl: res.data.imageUrl ,userid:res.data.userId};
      localStorage.setItem('user', JSON.stringify(userData));
      
      setImageUrl(res.data.imageUrl);
      alert('Login successful');
      window.location.href='/communities'
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>

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

              <button className="btn btn-primary btn-block mb-3" onClick={handleLogin}>
                Login
              </button>

              {imageUrl && (
                <div className="text-center">
                  <img src={imageUrl} alt="User" className="img-fluid rounded-circle" style={{ width: '150px' }} />
                  <p className="mt-2">{email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
