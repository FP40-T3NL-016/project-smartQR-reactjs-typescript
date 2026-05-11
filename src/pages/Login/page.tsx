import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadUsers, setCurrentUser } from '../../utils/smartQR';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Demo tip: register first, then login with the same email and password.');

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const users = loadUsers();
    const matchedUser = users.find((user) => user.email === email.trim().toLowerCase() && user.password === password);

    if (!matchedUser) {
      setMessage('Invalid email or password. Please register first or check your details.');
      return;
    }

    setCurrentUser(matchedUser);
    setMessage('Login successful. Redirecting to dashboard...');
    window.setTimeout(() => navigate('/dashboard'), 700);
  };

  return (
    <main className="page auth-page">
      <section className="auth-layout">
        <div className="auth-info">
          <span className="badge">Secure Access Page</span>
          <h2>Login / Sign In</h2>
          <p>This page is added as a compulsory requirement of the assignment. It gives users a clean login interface before they access the dashboard.</p>
          <ul className="feature-list">
            <li>Checks email and password fields before login.</li>
            <li>Uses localStorage for simple class-project demo login.</li>
            <li>Keeps the same visual design as the main website.</li>
          </ul>
        </div>

        <form className="form-container auth-form" onSubmit={handleLogin}>
          <h3>Welcome Back</h3>
          <p>Sign in to continue to the SmartQR dashboard.</p>

          <div>
            <label htmlFor="loginEmail">Email Address</label>
            <input id="loginEmail" type="email" placeholder="example@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>

          <div>
            <label htmlFor="loginPassword">Password</label>
            <input id="loginPassword" type="password" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>

          <div className="actions">
            <button type="submit">Login</button>
            <Link className="link-button border-button" to="/register">Create Account</Link>
          </div>

          <p className="small-note">{message}</p>
        </form>
      </section>
    </main>
  );
}

export default Login;
