import { Link } from 'react-router-dom';

function Home() {
  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="badge">React TypeScript QR Project</span>
          <h1>Smart QR Code Reader and Data Analyzer</h1>
          <p>This web application reads QR code data through camera, uploaded QR image and manual input. It analyzes embedded information using pattern recognition and classifies URLs, phone numbers, emails, WiFi records, product codes, payment data and plain text.</p>
          <p>This version is converted from simple webpages into a proper React JS TypeScript project with reusable components, pages and router-based navigation.</p>
          <div className="actions">
            <Link className="link-button lg-button" to="/scanner">Scan QR Code</Link>
            <Link className="link-button border-button lg-button" to="/dashboard">Open Dashboard</Link>
            <Link className="link-button border-button lg-button" to="/login">Login</Link>
          </div>
        </div>
        <div>
          <img src="/images/image1.png" alt="Smart QR Code Reader and Data Analyzer" />
        </div>
      </section>
    </main>
  );
}

export default Home;
