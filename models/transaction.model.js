import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';
import enumModel from './enum.model';

const TransactionSchema = new mongoose.Schema(
  {
    coinAmount: Number,
    receiverUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    senderUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    transactionType: {
      type: String,
      enum: Object.values(enumModel.EnumTransactionType),
      default: enumModel.EnumTransactionType,
    },
    description: {
      type: String,
    },
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
TransactionSchema.plugin(toJSON);
TransactionSchema.plugin(mongoosePaginateV2);
TransactionSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const TransactionModel = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema, 'Transaction');
module.exports = TransactionModel;
