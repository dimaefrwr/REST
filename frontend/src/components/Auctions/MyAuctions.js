import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionsAPI } from '../../services/api';

const MyAuctions = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyAuctions();
  }, []);

  const fetchMyAuctions = async () => {
    try {
      setLoading(true);
      const response = await auctionsAPI.getMyAuctions();
      setAuctions(response.data.auctions);
    } catch (err) {
      setError('Błąd pobierania moich aukcji');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAuction = async (id) => {
    if (!window.confirm('Czy na pewno chcesz anulować tę aukcję?')) return;

    try {
      await auctionsAPI.cancelAuction(id);
      fetchMyAuctions();
    } catch (err) {
      alert(err.response?.data?.message || 'Błąd anulowania aukcji');
    }
  };

  const getStatusLabel = (status) => {
    const statuses = {
      active: { label: 'Aktywna', color: '#28a745' },
      completed: { label: 'Zakończona', color: '#6c757d' },
      cancelled: { label: 'Anulowana', color: '#dc3545' }
    };
    return statuses[status] || statuses.active;
  };

  if (loading) {
    return <div style={styles.loading}>Ładowanie...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Moje aukcje</h1>

      {error && <div style={styles.error}>{error}</div>}

      {auctions.length === 0 ? (
        <div style={styles.empty}>
          <p>Nie masz jeszcze żadnych aukcji</p>
          <button 
            style={styles.createButton}
            onClick={() => navigate('/create-auction')}
          >
            Utwórz pierwszą aukcję
          </button>
        </div>
      ) : (
        <div style={styles.auctionList}>
          {auctions.map((auction) => {
            const statusInfo = getStatusLabel(auction.status);
            return (
              <div key={auction._id} style={styles.auctionCard}>
                <img 
                  src={auction.imageUrl} 
                  alt={auction.title}
                  style={styles.image}
                />
                <div style={styles.cardContent}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{auction.title}</h3>
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
                    <div>
                      <span style={styles.label}>Aktualna cena:</span>
                      <span style={styles.value}>{auction.currentPrice} PLN</span>
                    </div>
                    <div>
                      <span style={styles.label}>Liczba ofert:</span>
                      <span style={styles.value}>{auction.bidCount}</span>
                    </div>
                    <div>
                      <span style={styles.label}>Zakończenie:</span>
                      <span style={styles.value}>
                        {new Date(auction.endDate).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                  </div>
                  <div style={styles.actions}>
                    <button
                      style={styles.detailsButton}
                      onClick={() => navigate(`/auctions/${auction._id}`)}
                    >
                      Szczegóły
                    </button>
                    {auction.status === 'active' && (
                      <button
                        style={styles.cancelButton}
                        onClick={() => handleCancelAuction(auction._id)}
                      >
                        Anuluj
                      </button>
                    )}
                  </div>
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
  createButton: {
    marginTop: '20px',
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  auctionList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  auctionCard: {
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
    fontWeight: '500'
  },
  cardInfo: {
    marginBottom: '15px'
  },
  label: {
    fontSize: '14px',
    color: '#666',
    marginRight: '8px'
  },
  value: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginRight: '20px'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  detailsButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  cancelButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  }
};

export default MyAuctions;