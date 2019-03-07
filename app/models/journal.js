const mongoose = require('mongoose');


const journalSchema = mongoose.Schema({

  created: { type: Date, default: Date.now },
  morningRating: Number,
  excitedAbout: [String],
  priorities: [String],
  toDoList: [String],
  eveningRating: Number,
  describeToday: [String],
  todayWins: [String],
  toImprove: String,
  gratitude: [String],
  journalEntry: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

journalSchema.pre('find', function (next) {
  this.populate('user');
  next();
})

journalSchema.pre('findOne', function (next) {
  this.populate('user');
  next();
})

journalSchema.methods.moodData = function () {
  return {
    morningRating: this.morningRating,
    eveningRating: this.eveningRating,
    created: this.created
  };
};
module.exports = mongoose.model('Journal', journalSchema);