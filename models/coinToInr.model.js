import mongoose from 'mongoose';
import { toJSON } from './plugins';

const CoinToInrSchema = mongoose.Schema(
  {
    oneRsValueInCoin: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
CoinToInrSchema.plugin(toJSON);


const CoinToInr = mongoose.model('coinToInr', CoinToInrSchema);
module.exports = CoinToInr;
