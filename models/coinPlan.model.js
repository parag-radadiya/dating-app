import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON, softDelete } from './plugins';

const CoinPlanSchema = new mongoose.Schema(
  {
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
    amountPerUnit: {
      type: Number,
    },
    amount: Number,
    coins: Number,
    discountPercentage: Number,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);
CoinPlanSchema.plugin(toJSON);
CoinPlanSchema.plugin(mongoosePaginateV2);
CoinPlanSchema.plugin(softDelete, {
  isSoftDeleteAddon: true,
  overrideMethods: 'all',
  deleted: 'isDeleted',
  deletedBy: 'deletedBy',
  deletedAt: 'deletedAt',
});
const CoinPlanModel = mongoose.models.CoinPlan || mongoose.model('CoinPlan', CoinPlanSchema, 'CoinPlan');
module.exports = CoinPlanModel;
