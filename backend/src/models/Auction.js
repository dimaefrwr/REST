const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Nazwa przedmiotu jest wymagana'],
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Opis przedmiotu jest wymagany'],
    minlength: 10,
    maxlength: 2000
  },
  category: {
    type: String,
    required: [true, 'Kategoria jest wymagana'],
    enum: ['electronics', 'fashion', 'home', 'sports', 'books', 'art', 'other'],
    default: 'other'
  },
  startingPrice: {
    type: Number,
    required: [true, 'Cena wywoławcza jest wymagana'],
    min: [0, 'Cena wywoławcza nie może być ujemna']
  },
  currentPrice: {
    type: Number,
    default: function() {
      return this.startingPrice;
    }
  },
  startDate: {
    type: Date,
    required: [true, 'Data rozpoczęcia jest wymagana'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Data zakończenia jest wymagana']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/400x300'
  },
  bidCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


auctionSchema.index({ title: 'text', description: 'text' });
auctionSchema.index({ endDate: 1, status: 1 });


auctionSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'active' && this.endDate > now;
};


auctionSchema.pre('save', function(next) {
  if (this.endDate < new Date() && this.status === 'active') {
    this.status = 'completed';
  }
  next();
});

module.exports = mongoose.model('Auction', auctionSchema);