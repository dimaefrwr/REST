import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bidsAPI } from '../../services/api';

const MyBids = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const response = await bidsAPI.getMyBids();
      setBids(response.data.bids);
    } catch (err) {
      setError('Błąd pobierania moich ofert');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (bid) => {
    const auction = bid.auction;
    const isEnded = new Date(auction.endDate) < new Date();
    
    if (auction.status === 'cancelled') {
      return { label: 'Aukcja anulowana', color: '#dc3545' };
    }
    
    if (isEnded || auction.status === 'completed') {
      if (bid.status === 'active') {
        return { label: 'Wygrana!', color: '#28a745' };
      }
      return { label: 'Przegrana', color: '#6c757d' };
    }
    
    if (bid.status === 'active') {
      return { label: 'Prowadzisz', color: '#28a745' };
    }
    
    return { label: 'Przebity', color: '#ffc107' };
  };

  if (loading) {
    return <div style={styles.loading}>Ładowanie...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Moje oferty</h1>

      {error && <div style={styles.error}>{error}</div>}

      {bids.length === 0 ? (
        <div style={styles.empty}>
          <p>Nie złożyłeś jeszcze żadnej oferty</p>
          <button 
            style={styles.browseButton}
            onClick={() => navigate('/')}
          >
            Przeglądaj aukcje
          </button>
        </div>
      ) : (
        <div style={styles.bidsList}>
          {bids.map((bid) => {
            const statusInfo = getStatusLabel(bid);
            return (
              <div key={bid._id} style={styles.bidCard}>
                <img 
                  src={bid.auction?.imageUrl} 
                  alt={bid.auction?.title}
                  style={styles.image}
                />
                <div style={styles.cardContent}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{bid.auction?.title}</h3>
                    <span 
                      style={{
                        ...styles.status,
                        backgroundColor: statusInfo.color
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <div style={styles.cardInfo}>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Twoja oferta:</span>
                      <span style={styles.value}>{bid.amount} PLN</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Aktualna cena:</span>
                      <span style={styles.value}>{bid.auction?.currentPrice} PLN</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Data oferty:</span>
                      <span style={styles.value}>
                        {new Date(bid.bidDate).toLocaleString('pl-PL')}
                      </span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.label}>Zakończenie:</span>
                      <span style={styles.value}>
                        {new Date(bid.auction?.endDate).toLocaleString('pl-PL')}
                      </span>
                    </div>
                  </div>
                  <button
                    style={styles.detailsButton}
                    onClick={() => navigate(`/auctions/${bid.auction?._id}`)}
                  >
                    Zobacz aukcję
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '30px'
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
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px'
  },
  empty: {
    textAlign: 'center',
    padding: '50px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  browseButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  bidsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  bidCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  cardContent: {
    padding: '20px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
    flex: 1
  },
  status: {
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  cardInfo: {
    marginBottom: '15px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  label: {
    fontSize: '14px',
    color: '#666'
  },
  value: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  detailsButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default MyBids;