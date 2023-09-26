import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const emojiSchema = new mongoose.Schema(
  {
    emojiUrl: String,
    coin: 'Number',
    /**
     * created By
     * */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    /**
     * updated By
     * */
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
emojiSchema.plugin(toJSON);
emojiSchema.plugin(mongoosePaginateV2);
emojiSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const emojiModel = mongoose.models.Emoji || mongoose.model('emoji', emojiSchema, 'Emoji');
module.exports = emojiModel;
