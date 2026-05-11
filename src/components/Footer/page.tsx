import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div>
          <h2>SmartQR Analyzer</h2>
          <p>A browser-based QR reader and data analyzer converted into React JS with TypeScript.</p>
        </div>
        <div>
          <h3>Pages</h3>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/scanner">Scanner</Link>
          <Link to="/analytics">Analytics</Link>
          <Link to="/history">History</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
        <div>
          <h3>Features</h3>
          <p>Camera scan, QR image upload, manual input, record management, category detection, risk suggestion and saved history.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
