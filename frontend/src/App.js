import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuctionList from './components/Auctions/AuctionList';
import AuctionDetails from './components/Auctions/AuctionDetails';
import CreateAuction from './components/Auctions/CreateAuction';
import MyAuctions from './components/Auctions/MyAuctions';
import BidForm from './components/Bids/BidForm';
import MyBids from './components/Bids/MyBids';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div style={styles.app}>
        {/* Navbar */}
        <nav style={styles.navbar}>
          <div style={styles.navContainer}>
            <Link to="/" style={styles.logo}>
              🔨 AuctionSystem
            </Link>
            
            <div style={styles.navLinks}>
              <Link to="/" style={styles.navLink}>
                Aukcje
              </Link>
              
              {user ? (
                <>
                  <Link to="/my-auctions" style={styles.navLink}>
                    Moje aukcje
                  </Link>
                  <Link to="/my-bids" style={styles.navLink}>
                    Moje oferty
                  </Link>
                  <span style={styles.userInfo}>
                    Witaj, {user.name}
                  </span>
                  <button onClick={handleLogout} style={styles.logoutButton}>
                    Wyloguj
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.navLink}>
                    Logowanie
                  </Link>
                  <Link to="/register" style={styles.registerButton}>
                    Rejestracja
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<AuctionList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auctions/:id" element={<AuctionDetails />} />
          <Route 
            path="/create-auction" 
            element={user ? <CreateAuction /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-auctions" 
            element={user ? <MyAuctions /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/bid/:id" 
            element={user ? <BidForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-bids" 
            element={user ? <MyBids /> : <Navigate to="/login" />} 
          />
        </Routes>

        {/* Footer */}
        <footer style={styles.footer}>
          <p style={styles.footerText}>
            © 2024 Auction System. Projekt studencki - System aukcyjny.
          </p>
        </footer>
      </div>
    </Router>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f5f5'
  },
  navbar: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '15px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#007bff',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  navLink: {
    color: '#333',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500'
  },
  userInfo: {
    color: '#666',
    fontSize: '14px'
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  registerButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500'
  },
  footer: {
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    padding: '20px',
    marginTop: 'auto',
    textAlign: 'center'
  },
  footerText: {
    color: '#666',
    fontSize: '14px',
    margin: 0
  }
};

export default App;