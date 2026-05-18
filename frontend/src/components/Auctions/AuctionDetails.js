import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auctionsAPI, bidsAPI } from '../../services/api';

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAuctionDetails();
    fetchBids();
  }, [id]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      const response = await auctionsAPI.getAuctionById(id);
      setAuction(response.data.auction);
    } catch (err) {
      setError('Błąd pobierania szczegółów aukcji');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await bidsAPI.getAuctionBids(id);
      setBids(response.data.bids);
    } catch (err) {
      console.error('Błąd pobierania ofert:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryLabel = (category) => {
    const categories = {
      electronics: 'Elektronika',
      fashion: 'Moda',
      home: 'Dom i ogród',
      sports: 'Sport',
      books: 'Książki',
      art: 'Sztuka',
      other: 'Inne'
    };
    return categories[category] || category;
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return 'Aukcja zakończona';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} dni, ${hours} godz.`;
    if (hours > 0) return `${hours} godz., ${minutes} min.`;
    return `${minutes} min.`;
  };

  const handleBidNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate(`/bid/${id}`);
  };

  if (loading) {
    return <div style={styles.loading}>Ładowanie...</div>;
  }

  if (error || !auction) {
    return <div style={styles.error}>{error || 'Aukcja nie znaleziona'}</div>;
  }

  const isActive = new Date(auction.endDate) > new Date() && auction.status === 'active';

  return (
    <div style={styles.container}>
      <button 
        onClick={() => navigate('/')} 
        style={styles.backButton}
      >
        ← Powrót do listy
      </button>

      <div style={styles.auctionCard}>
        <img 
          src={auction.imageUrl} 
          alt={auction.title}
          style={styles.auctionImage}
        />
        
        <div style={styles.content}>
          <div style={styles.header}>
            <div>
              <span style={styles.category}>
                {getCategoryLabel(auction.category)}
              </span>
              <h1 style={styles.title}>{auction.title}</h1>
            </div>
            <div style={styles.priceBox}>
              <span style={styles.priceLabel}>Aktualna cena</span>
              <span style={styles.price}>{auction.currentPrice} PLN</span>
            </div>
          </div>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>⏰</span>
              <div>
                <span style={styles.infoLabel}>Czas do zakończenia</span>
                <span style={styles.infoValue}>{getTimeRemaining(auction.endDate)}</span>
              </div>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>📊</span>
              <div>
                <span style={styles.infoLabel}>Liczba ofert</span>
                <span style={styles.infoValue}>{auction.bidCount}</span>
              </div>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>💰</span>
              <div>
                <span style={styles.infoLabel}>Cena wywoławcza</span>
                <span style={styles.infoValue}>{auction.startingPrice} PLN</span>
              </div>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>👤</span>
              <div>
                <span style={styles.infoLabel}>Sprzedawca</span>
                <span style={styles.infoValue}>{auction.owner?.name}</span>
              </div>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>📅</span>
              <div>
                <span style={styles.infoLabel}>Data zakończenia</span>
                <span style={styles.infoValue}>{formatDate(auction.endDate)}</span>
              </div>
            </div>

            <div style={styles.infoItem}>
              <span style={styles.infoIcon}>🏷️</span>
              <div>
                <span style={styles.infoLabel}>Status</span>
                <span style={styles.infoValue}>
                  {auction.status === 'active' ? 'Aktywna' : 
                   auction.status === 'completed' ? 'Zakończona' : 'Anulowana'}
                </span>
              </div>
            </div>
          </div>

          <div style={styles.description}>
            <h2 style={styles.sectionTitle}>Opis przedmiotu</h2>
            <p style={styles.descriptionText}>{auction.description}</p>
          </div>

          {bids.length > 0 && (
            <div style={styles.bidsSection}>
              <h2 style={styles.sectionTitle}>Historia licytacji</h2>
              <div style={styles.bidsList}>
                {bids.slice(0, 5).map((bid, index) => (
                  <div key={bid._id} style={styles.bidItem}>
                    <div style={styles.bidRank}>#{index + 1}</div>
                    <div style={styles.bidInfo}>
                      <span style={styles.bidderName}>{bid.bidder?.name}</span>
                      <span style={styles.bidDate}>
                        {new Date(bid.bidDate).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <div style={styles.bidAmount}>{bid.amount} PLN</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={styles.actions}>
            {isActive ? (
              <button 
                style={styles.bidButton}
                onClick={handleBidNow}
              >
                Licytuj teraz
              </button>
            ) : (
              <button style={styles.endedButton} disabled>
                Aukcja zakończona
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px'
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '20px',
    borderRadius: '4px',
    margin: '20px',
    textAlign: 'center'
  },
  auctionCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  auctionImage: {
    width: '100%',
    height: '400px',
    objectFit: 'cover'
  },
  content: {
    padding: '30px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  category: {
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '10px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0
  },
  priceBox: {
    textAlign: 'right'
  },
  priceLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px'
  },
  price: {
    display: 'block',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#28a745'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  infoItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start'
  },
  infoIcon: {
    fontSize: '24px'
  },
  infoLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#999',
    marginBottom: '4px'
  },
  infoValue: {
    display: 'block',
    fontSize: '14px',
    color: '#333',
    fontWeight: '500'
  },
  description: {
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px'
  },
  descriptionText: {
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.8'
  },
  bidsSection: {
    marginBottom: '30px'
  },
  bidsList: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '15px'
  },
  bidItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
    marginBottom: '10px'
  },
  bidRank: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#999',
    marginRight: '15px',
    minWidth: '30px'
  },
  bidInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  bidderName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  bidDate: {
    fontSize: '12px',
    color: '#999'
  },
  bidAmount: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#28a745'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  bidButton: {
    flex: 1,
    padding: '15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  endedButton: {
    flex: 1,
    padding: '15px',
    backgroundColor: '#ccc',
    color: '#666',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'not-allowed'
  }
};

export default AuctionDetails;