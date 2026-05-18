const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  auction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Kwota oferty jest wymagana'],
    min: 0
  },
  bidDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'outbid', 'winning'],
    default: 'active'
  }
});


bidSchema.index({ auction: 1, bidDate: -1 });
bidSchema.index({ bidder: 1, bidDate: -1 });


bidSchema.index({ auction: 1, bidder: 1, status: 1 });

module.exports = mongoose.model('Bid', bidSchema);