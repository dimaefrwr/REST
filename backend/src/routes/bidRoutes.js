const express = require('express');
const router = express.Router();
const {
  placeBid,
  getAuctionBids,
  getMyBids,
  getBidById
} = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/auctions/{id}/bids:
 *   post:
 *     summary: Złóż ofertę w aukcji
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID aukcji
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Kwota oferty
 *     responses:
 *       201:
 *         description: Oferta złożona pomyślnie
 *       400:
 *         description: Błąd walidacji
 */
router.post('/:id/bids', protect, placeBid);

/**
 * @swagger
 * /api/auctions/{id}/bids:
 *   get:
 *     summary: Pobierz historię ofert dla aukcji
 *     tags: [Bids]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Historia ofert
 */
router.get('/:id/bids', getAuctionBids);

/**
 * @swagger
 * /api/bids/my-bids:
 *   get:
 *     summary: Pobierz moje oferty
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista moich ofert
 */
router.get('/my-bids', protect, getMyBids);

/**
 * @swagger
 * /api/bids/{id}:
 *   get:
 *     summary: Pobierz ofertę po ID
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Szczegóły oferty
 */
router.get('/:id', protect, getBidById);

module.exports = router;