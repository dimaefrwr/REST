import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auctionsAPI, bidsAPI } from '../../services/api';

const BidForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAuctionDetails();
  }, [id]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      const response = await auctionsAPI.getAuctionById(id);
      setAuction(response.data.auction);
      setAmount((response.data.auction.currentPrice + 1).toString());
    } catch (err) {
      setError('Błąd pobierania szczegółów aukcji');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await bidsAPI.placeBid(id, { amount: parseFloat(amount) });
      setSuccess(true);
      setTimeout(() => {
        navigate(`/auctions/${id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Błąd składania oferty');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Ładowanie...</div>;
  }

  if (!auction) {
    return <div style={styles.error}>Aukcja nie znaleziona</div>;
  }

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Oferta złożona pomyślnie!</h2>
          <p style={styles.successText}>
            Przekierowujemy do aukcji...
          </p>
        </div>
      </div>
    );
  }

  const minBid = auction.currentPrice + 1;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Licytuj przedmiot</h2>
        
        <div style={styles.auctionSummary}>
          <h3 style={styles.auctionTitle}>{auction.title}</h3>
          <div style={styles.summaryGrid}>
            <div>
              <span style={styles.summaryLabel}>Aktualna cena:</span>
              <span style={styles.currentPrice}>{auction.currentPrice} PLN</span>
            </div>
            <div>
              <span style={styles.summaryLabel}>Liczba ofert:</span>
              <span style={styles.summaryValue}>{auction.bidCount}</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Twoja oferta (minimalna: {minBid} PLN)
            </label>
            <div style={styles.bidInputWrapper}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={minBid}
                step="1"
                required
                style={styles.bidInput}
              />
              <span style={styles.currency}>PLN</span>
            </div>
            <p style={styles.hint}>
              Podaj kwotę wyższą od aktualnej ceny
            </p>
          </div>

          <div style={styles.infoBox}>
            <h4 style={styles.infoTitle}>ℹ️ Informacje</h4>
            <ul style={styles.infoList}>
              <li>Twoja oferta jest wiążąca</li>
              <li>Jeśli zostaniesz przebity, powiadomimy Cię</li>
              <li>Zwycięzca aukcji zostanie poinformowany po jej zakończeniu</li>
            </ul>
          </div>

          <button
            type="submit"
            style={styles.submitButton}
            disabled={submitting || parseFloat(amount) < minBid}
          >
            {submitting ? 'Składanie oferty...' : 'Złóż ofertę'}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/auctions/${id}`)}
            style={styles.cancelButton}
          >
            Anuluj
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#333'
  },
  auctionSummary: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px'
  },
  auctionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px'
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  summaryLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    marginBottom: '5px'
  },
  currentPrice: {
    display: 'block',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#28a745'
  },
  summaryValue: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '500',
    color: '#333'
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
  errorBox: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  formGroup: {
    marginBottom: '30px'
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '500',
    color: '#333'
  },
  bidInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  bidInput: {
    flex: 1,
    padding: '15px',
    border: '2px solid #007bff',
    borderRadius: '4px',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  currency: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#666'
  },
  hint: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#666',
    textAlign: 'center'
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  infoTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: '10px'
  },
  infoList: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#333',
    lineHeight: '1.8'
  },
  submitButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '10px'
  },
  cancelButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: 'white',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  successCard: {
    backgroundColor: 'white',
    padding: '60px 40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  successIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: '10px'
  },
  successText: {
    fontSize: '16px',
    color: '#666'
  }
};

export default BidForm;