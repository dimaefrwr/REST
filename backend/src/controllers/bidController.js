const Bid = require('../models/Bid');
const Auction = require('../models/Auction');

// Złożenie oferty
exports.placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const auctionId = req.params.id;
    const bidderId = req.user.id;

    

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Aukcja nie znaleziona'
      });
    }

    
    if (!auction.isActive()) {
      return res.status(400).json({
        success: false,
        message: 'Aukcja nie jest już aktywna'
      });
    }

    // Nie można licytować własnej aukcji
    if (auction.owner.toString() === bidderId) {
      return res.status(400).json({
        success: false,
        message: 'Nie możesz licytować własnej aukcji'
      });
    }

    
    if (amount <= auction.currentPrice) {
      return res.status(400).json({
        success: false,
        message: `Oferta musi być wyższa niż aktualna cena (${auction.currentPrice} PLN)`
      });
    }

    
    await Bid.updateMany(
      { auction: auctionId, status: 'active' },
      { status: 'outbid' }
    );

    
    const bid = await Bid.create({
      auction: auctionId,
      bidder: bidderId,
      amount: amount,
      status: 'active'
    });

   
    auction.currentPrice = amount;
    auction.bidCount += 1;
    await auction.save();

    const populatedBid = await Bid.findById(bid._id)
      .populate('bidder', 'name email')
      .populate('auction', 'title');

    res.status(201).json({
      success: true,
      message: 'Oferta złożona pomyślnie',
      bid: populatedBid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd składania oferty',
      error: error.message
    });
  }
};


exports.getAuctionBids = async (req, res) => {
  try {
    const bids = await Bid.find({ auction: req.params.id })
      .populate('bidder', 'name')
      .sort({ bidDate: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd pobierania historii ofert',
      error: error.message
    });
  }
};


exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ bidder: req.user.id })
      .populate('auction', 'title endDate status currentPrice imageUrl')
      .sort({ bidDate: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd pobierania ofert',
      error: error.message
    });
  }
};


exports.getBidById = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id)
      .populate('auction')
      .populate('bidder', 'name email');

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Oferta nie znaleziona'
      });
    }

    
    if (bid.bidder._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do tej oferty'
      });
    }

    res.status(200).json({
      success: true,
      bid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd pobierania oferty',
      error: error.message
    });
  }
};