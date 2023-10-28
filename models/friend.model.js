const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const enumModel = require('./enum.model');

const statusHistorySchema = mongoose.Schema({
  status: { type: String, enum: ['follower', 'following', 'blocked'], required: true },
  date: { type: Date, default: new Date() },
  initiator: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
});

const friendSchema = mongoose.Schema(
  {
    friend: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    userStar: { type: Boolean, default: false },
    friendStar: { type: Boolean, default: false },
    userBlock: { type: Boolean, default: false },
    friendBlock: { type: Boolean, default: false },
    statusHistory: {
      type: [statusHistorySchema],
    },
    status: {
      type: String,
      enum: enumModel.EnumOfFriends,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

friendSchema.plugin(toJSON);
// friendSchema.plugin(paginate);
friendSchema.plugin(require('mongoose-aggregate-paginate-v2'));
friendSchema.plugin(require('mongoose-paginate-v2'));

/**
 * Check if already Friend
 * @param {string} friend - Friend's Id
 * @param {string} user - The If of the Self User
 * @returns {Promise<boolean>}
 */
// friendSchema.statics.getFriend = async function (friend, user) {
//     const friendObj = await this.findOne({
//         $or: [
//             { user, friend },
//             { user: friend, friend: user },
//         ],
//     });
//     return friendObj;
// };

/**
 * Get One Friend by Query
 * @param {query} id
 * @returns {Promise<Friend>}
 */

// friendSchema.statics.getOneFriend = async function (query) {
//     return this.findOne(query);
// };

/**
 * @typedef Friend
 */
const Friend = mongoose.model('Friend', friendSchema);

// Friend.aggregatePaginate.options = {
//     customLabels: { docs: 'results', totalDocs: 'totalResults' },
// };

module.exports = Friend;
