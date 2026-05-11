import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { applySavedTheme, toggleThemeMode } from '../../utils/smartQR';

const links = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/scanner', label: 'Scanner' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/history', label: 'History' },
  { path: '/login', label: 'Login' },
  { path: '/register', label: 'Register' }
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    applySavedTheme();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav>
      <Link to="/" onClick={closeMenu}>SmartQR Analyzer</Link>
      <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      <ul id="mainMenu" className={menuOpen ? 'open' : ''}>
        {links.map((link) => (
          <li key={link.path}>
            <NavLink to={link.path} onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-active' : '')}>
              {link.label}
            </NavLink>
          </li>
        ))}
        <li>
          <button className="tiny-button" type="button" onClick={toggleThemeMode}>Theme</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
