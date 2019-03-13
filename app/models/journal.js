const mongoose = require('mongoose');
const moment = require('moment');

const journalSchema = mongoose.Schema({

  created: { type: Date, default: Date.now },
  morningRating: Number,
  excitedAbout: [String],
  priorities: [String],
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
    created: moment(this.created).format("YYYY-MM-DD")
  };
};
journalSchema.methods.serialize = function () {
  return {
    created: moment(this.created).format("ddd, MMM DD, YYYY"),
  morningRating: this.morningRating,
  excitedAbout: this.excitedAbout,
  priorities: this.priorities,
  eveningRating: this.eveningRating,
  describeToday: this.describeToday,
  todayWins: this.todayWins,
  toImprove: this.toImprove,
  gratitude: this.gratitude,
  journalEntry: this.journalEntry,
  user: this.user
  };
};
module.exports = mongoose.model('Journal', journalSchema);