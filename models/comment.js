'use strict';

var mongoose = require('mongoose');
var _ = require('underscore');

var commentSchema = mongoose.Schema({
  author:   { type: String, ref: 'User', required: true },
  postedAt: { type: Date, default: Date.now, index: true },
  text:     { type: String, trim: true, required: true }
});

_.extend(commentSchema.statics, {
  getAll: function getAllComments() {
    return this.find().populate('author').sort({ postedAt: -1 }).exec();
  }
});

module.exports = mongoose.model('Comment', commentSchema);
