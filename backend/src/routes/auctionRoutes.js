const express = require('express');
const router = express.Router();
const {
  getAllAuctions,
  getAuctionById,
  createAuction,
  updateAuction,
  deleteAuction,
  getMyAuctions,
  cancelAuction
} = require('../controllers/auctionController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/auctions:
 *   get:
 *     summary: Pobierz wszystkie aukcje
 *     tags: [Auctions]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista aukcji
 */
router.get('/', getAllAuctions);

/**
 * @swagger
 * /api/auctions/my-auctions:
 *   get:
 *     summary: Pobierz moje aukcje (jako właściciel)
 *     tags: [Auctions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista moich aukcji
 */
router.get('/my-auctions', protect, getMyAuctions);

/**
 * @swagger
 * /api/auctions/{id}:
 *   get:
 *     summary: Pobierz aukcję po ID
 *     tags: [Auctions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Szczegóły aukcji
 *       404:
 *         description: Aukcja nie znaleziona
 */
router.get('/:id', getAuctionById);

/**
 * @swagger
 * /api/auctions:
 *   post:
 *     summary: Utwórz nową aukcję
 *     tags: [Auctions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Aukcja utworzona
 */
router.post('/', protect, createAuction);

/**
 * @swagger
 * /api/auctions/{id}:
 *   put:
 *     summary: Zaktualizuj aukcję
 *     tags: [Auctions]
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
 *         description: Aukcja zaktualizowana
 */
router.put('/:id', protect, updateAuction);

/**
 * @swagger
 * /api/auctions/{id}:
 *   delete:
 *     summary: Usuń aukcję
 *     tags: [Auctions]
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
 *         description: Aukcja usunięta
 */
router.delete('/:id', protect, deleteAuction);

/**
 * @swagger
 * /api/auctions/{id}/cancel:
 *   put:
 *     summary: Anuluj aukcję
 *     tags: [Auctions]
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
 *         description: Aukcja anulowana
 */
router.put('/:id/cancel', protect, cancelAuction);

module.exports = router;