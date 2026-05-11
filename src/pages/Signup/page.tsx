import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadUsers, saveUsers, setCurrentUser } from '../../utils/smartQR';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('Your demo account will be saved locally in this browser.');

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const finalName = name.trim();
    const finalEmail = email.trim().toLowerCase();

    if (!finalName || !finalEmail || !password || !confirmPassword) {
      setMessage('Please complete all fields.');
      return;
    }

    if (password.length < 4) {
      setMessage('Password should contain at least 4 characters for this demo.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Password and confirm password do not match.');
      return;
    }

    const users = loadUsers();
    const existingUser = users.find((user) => user.email === finalEmail);

    if (existingUser) {
      setMessage('This email is already registered. Please login instead.');
      return;
    }

    const newUser = { name: finalName, email: finalEmail, password };
    saveUsers([...users, newUser]);
    setCurrentUser(newUser);
    setMessage('Account created successfully. Redirecting to dashboard...');
    window.setTimeout(() => navigate('/dashboard'), 900);
  };

  return (
    <main className="page auth-page">
      <section className="auth-layout">
        <div className="auth-info">
          <span className="badge">New User Page</span>
          <h2>Register / Sign Up</h2>
          <p>This page allows a new user to create a simple account for the SmartQR Analyzer project. It is suitable for a front-end Web Systems and Technology assignment.</p>
          <ul className="feature-list">
            <li>Collects full name, email and password.</li>
            <li>Validates that both password fields match.</li>
            <li>Saves demo account data in browser localStorage.</li>
          </ul>
        </div>

        <form className="form-container auth-form" onSubmit={handleRegister}>
          <h3>Create Account</h3>
          <p>Register to access the dashboard demo.</p>

          <div>
            <label htmlFor="registerName">Full Name</label>
            <input id="registerName" type="text" placeholder="Enter full name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>

          <div>
            <label htmlFor="registerEmail">Email Address</label>
            <input id="registerEmail" type="email" placeholder="example@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>

          <div>
            <label htmlFor="registerPassword">Password</label>
            <input id="registerPassword" type="password" placeholder="Create password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" placeholder="Confirm password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          </div>

          <div className="actions">
            <button type="submit">Register</button>
            <Link className="link-button border-button" to="/login">Already Registered?</Link>
          </div>

          <p className="small-note">{message}</p>
        </form>
      </section>
    </main>
  );
}

export default Register;
