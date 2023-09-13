import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const roomUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  mobileNumber: {
    type: Number,
    private: true,
  },
  userCallStartTime: {
    type: Date,
  },
  userCallEndTime: {
    type: Date,
  },
});

const RoomSchema = new mongoose.Schema(
  {
    isRoomTypeIsVideoCall: Boolean,
    users: [roomUserSchema],
    /**
     * created By
     * */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    /**
     * category
     * */
    category: {
      type: String,
    },
    /**
     * updated By
     * */
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    socketId: {
      type: String,
    },
    roomStartTime: {
      type: Date,
    },
    roomEndTime: {
      type: Date,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
RoomSchema.plugin(toJSON);
RoomSchema.plugin(mongoosePaginateV2);
RoomSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const RoomModel = mongoose.models.Room || mongoose.model('Room', RoomSchema, 'Room');
module.exports = RoomModel;
