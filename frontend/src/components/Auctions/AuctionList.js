import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionsAPI } from '../../services/api';

const AuctionList = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchAuctions();
  }, [filters]);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await auctionsAPI.getAllAuctions(filters);
      setAuctions(response.data.auctions);
    } catch (err) {
      setError('Błąd pobierania aukcji');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
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

    if (diff <= 0) return 'Zakończona';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} dni`;
    return `${hours} godz.`;
  };

  if (loading) {
    return <div style={styles.loading}>Ładowanie aukcji...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Aktywne Aukcje</h1>
        <button 
          style={styles.createButton}
          onClick={() => navigate('/create-auction')}
        >
          + Dodaj aukcję
        </button>
      </div>

      {/* Filtry */}
      <div style={styles.filters}>
        <input
          type="text"
          name="search"
          placeholder="Szukaj aukcji..."
          value={filters.search}
          onChange={handleFilterChange}
          style={styles.searchInput}
        />
        
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          style={styles.select}
        >
          <option value="">Wszystkie kategorie</option>
          <option value="electronics">Elektronika</option>
          <option value="fashion">Moda</option>
          <option value="home">Dom i ogród</option>
          <option value="sports">Sport</option>
          <option value="books">Książki</option>
          <option value="art">Sztuka</option>
          <option value="other">Inne</option>
        </select>

        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          style={styles.select}
        >
          <option value="">Tylko aktywne</option>
          <option value="active">Aktywne</option>
          <option value="completed">Zakończone</option>
          <option value="cancelled">Anulowane</option>
        </select>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Lista aukcji */}
      <div style={styles.auctionGrid}>
        {auctions.length === 0 ? (
          <p style={styles.noAuctions}>Brak aukcji spełniających kryteria</p>
        ) : (
          auctions.map((auction) => (
            <div 
              key={auction._id} 
              style={styles.auctionCard}
              onClick={() => navigate(`/auctions/${auction._id}`)}
            >
              <img 
                src={auction.imageUrl} 
                alt={auction.title}
                style={styles.auctionImage}
              />
              <div style={styles.auctionContent}>
                <span style={styles.category}>
                  {getCategoryLabel(auction.category)}
                </span>
                <h3 style={styles.auctionTitle}>{auction.title}</h3>
                <p style={styles.auctionDescription}>
                  {auction.description.substring(0, 100)}...
                </p>
                <div style={styles.auctionInfo}>
                  <div>
                    <span style={styles.infoLabel}>⏰</span>
                    {getTimeRemaining(auction.endDate)}
                  </div>
                  <div>
                    <span style={styles.infoLabel}>📊</span>
                    {auction.bidCount} ofert
                  </div>
                </div>
                <div style={styles.auctionFooter}>
                  <div>
                    <div style={styles.priceLabel}>Aktualna cena</div>
                    <span style={styles.price}>{auction.currentPrice} PLN</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333'
  },
  createButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  searchInput: {
    flex: '2',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minWidth: '200px'
  },
  select: {
    flex: '1',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minWidth: '150px'
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
  auctionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  noAuctions: {
    textAlign: 'center',
    padding: '50px',
    color: '#666',
    gridColumn: '1 / -1'
  },
  auctionCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  auctionImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  auctionContent: {
    padding: '15px'
  },
  category: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '10px'
  },
  auctionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px'
  },
  auctionDescription: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    lineHeight: '1.4'
  },
  auctionInfo: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between'
  },
  infoLabel: {
    marginRight: '5px'
  },
  auctionFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #eee'
  },
  priceLabel: {
    fontSize: '12px',
    color: '#999',
    marginBottom: '4px'
  },
  price: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#28a745'
  }
};

export default AuctionList;