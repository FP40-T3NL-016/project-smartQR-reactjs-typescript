import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/page';
import Footer from './components/Footer/page';
import Home from './pages/Home/page';
import Dashboard from './pages/Dashboard/page';
import Scanner from './pages/Scanner/page';
import Analytics from './pages/Analytics/page';
import History from './pages/History/page';
import Login from './pages/Login/page';
import Signup from './pages/Signup/page';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
