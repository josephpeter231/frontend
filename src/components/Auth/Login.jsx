import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      const userData = { email, imageUrl: res.data.imageUrl, userid: res.data.userId };
      localStorage.setItem('user', JSON.stringify(userData));
      setImageUrl(res.data.imageUrl);
      setErrorMessage('');
      alert('Login successful');
      window.location.href = '/communities';
    } catch (err) {
      setErrorMessage('Login failed! Please check your credentials.');
    }
  };

  const handleRegister = () => {
    window.location.href = "/register";
  }

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/forgot-password', {
        email: forgotEmail,
        newPassword: forgotPassword,
      });
      
      if (res.data.success) {
        setSuccessMessage('Password reset successful!');
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to reset password.');
      }
      setShowForgotModal(false);
    } catch (err) {
      setErrorMessage('Error resetting password.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>

              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

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

              <button className="btn btn-outline-secondary btn-block mb-3" onClick={handleRegister}>
                Register
              </button>

              <button className="btn btn-link" onClick={() => setShowForgotModal(true)}>
                Forgot Password?
              </button>

              {imageUrl && (
                <div className="text-center mt-4">
                  <img src={imageUrl} alt="User" className="img-fluid rounded-circle shadow-sm" style={{ width: '150px' }} />
                  <p className="mt-2">{email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Forgot Password</h5>
                <button type="button" className="btn-close" onClick={() => setShowForgotModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={forgotPassword}
                    onChange={(e) => setForgotPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowForgotModal(false)}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleForgotPassword}>
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
