import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';
import enumModel from './enum.model';

const roomUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  roomEndTime: {
    type: Date,
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
    sdpOffer: {
      type: mongoose.Schema.Types.Mixed,
    },
    roomStartTime: {
      type: Date,
    },
    roomEndTime: {
      type: Date,
    },
    roomType: {
      type: String,
      enum: Object.values(enumModel.EnumRoomType),
    },
    bothUserJoined: Boolean,
    agoraToken: String,
    channelName: String,
    userIdThatStartCall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isRoomTypeRj: {
      type: Boolean,
      default: false,
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
