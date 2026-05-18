const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Auction = require('../models/Auction');

let authToken;
let userId;

describe('Auction Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auction-test');
    
    // Utwórz użytkownika testowego
    const user = await User.create({
      name: 'Auction Owner',
      email: 'owner@example.com',
      password: 'password123'
    });
    
    userId = user._id;

    // Zaloguj się
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'owner@example.com',
        password: 'password123'
      });
    
    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await Auction.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/auctions', () => {
    it('powinno utworzyć nową aukcję', async () => {
      const futureDate = new Date(Date.now() + 86400000); // jutro
      
      const res = await request(app)
        .post('/api/auctions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Testowy Laptop',
          description: 'Wysokiej jakości laptop do testowania funkcji aukcji',
          category: 'electronics',
          startingPrice: 1000,
          startDate: new Date(),
          endDate: futureDate
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.auction).toHaveProperty('title', 'Testowy Laptop');
    });

    it('nie powinno utworzyć aukcji bez autoryzacji', async () => {
      const res = await request(app)
        .post('/api/auctions')
        .send({
          title: 'Nieautoryzowana aukcja',
          description: 'Opis',
          category: 'electronics',
          startingPrice: 100,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000)
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auctions', () => {
    it('powinno zwrócić listę aukcji', async () => {
      const res = await request(app)
        .get('/api/auctions');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.auctions)).toBe(true);
    });

    it('powinno filtrować aukcje po kategorii', async () => {
      const res = await request(app)
        .get('/api/auctions?category=electronics');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});