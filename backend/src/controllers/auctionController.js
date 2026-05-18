const Auction = require('../models/Auction');
const Bid = require('../models/Bid');


exports.getAllAuctions = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    let query = {};

   
    if (category) {
      query.category = category;
    }

    
    if (status) {
      query.status = status;
    } else {
      
      query.status = 'active';
    }

    
    if (search) {
      query.$text = { $search: search };
    }

    const auctions = await Auction.find(query)
      .populate('owner', 'name email')
      .populate('winner', 'name email')
      .sort({ endDate: 1 });

    res.status(200).json({
      success: true,
      count: auctions.length,
      auctions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd pobierania aukcji',
      error: error.message
    });
  }
};


exports.getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('winner', 'name email');

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Aukcja nie znaleziona'
      });
    }

    res.status(200).json({
      success: true,
      auction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd pobierania aukcji',
      error: error.message
    });
  }
};


exports.createAuction = async (req, res) => {
  try {
    const auctionData = {
      ...req.body,
      owner: req.user.id
    };

    
    const startDate = new Date(auctionData.startDate);
    const endDate = new Date(auctionData.endDate);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia'
      });
    }

    if (endDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Data zakończenia musi być w przyszłości'
      });
    }

    const auction = await Auction.create(auctionData);

    res.status(201).json({
      success: true,
      message: 'Aukcja utworzona pomyślnie',
      auction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd tworzenia aukcji',
      error: error.message
    });
  }
};


exports.updateAuction = async (req, res) => {
  try {
    let auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Aukcja nie znaleziona'
      });
    }

    
    if (auction.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do edycji tej aukcji'
      });
    }

    
    if (auction.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Nie można edytować zakończonej aukcji'
      });
    }

    
    if (auction.bidCount > 0 && req.body.startingPrice) {
      return res.status(400).json({
        success: false,
        message: 'Nie można zmienić ceny wywoławczej gdy są już oferty'
      });
    }

    auction = await Auction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Aukcja zaktualizowana pomyślnie',
      auction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd aktualizacji aukcji',
      error: error.message
    });
  }
};


exports.deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Aukcja nie znaleziona'
      });
    }

    
    if (auction.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do usunięcia tej aukcji'
      });
    }

    
    if (auction.bidCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Nie można usunąć aukcji na którą zostały złożone oferty. Możesz ją anulować.'
      });
    }

    await Auction.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Aukcja usunięta pomyślnie'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd usuwania aukcji',
      error: error.message
    });
  }
};


exports.getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ owner: req.user.id })
      .populate('winner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: auctions.length,
      auctions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd pobierania aukcji',
      error: error.message
    });
  }
};


exports.cancelAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: 'Aukcja nie znaleziona'
      });
    }

    
    if (auction.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Brak uprawnień do anulowania tej aukcji'
      });
    }

    if (auction.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Można anulować tylko aktywne aukcje'
      });
    }

    auction.status = 'cancelled';
    await auction.save();

    res.status(200).json({
      success: true,
      message: 'Aukcja anulowana pomyślnie'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Błąd anulowania aukcji',
      error: error.message
    });
  }
};