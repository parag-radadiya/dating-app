import mongoose from 'mongoose';

const { Schema } = mongoose;
const tempS3Schema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    url: String,
    key: String,
    fields: {
      ContentType: String,
      key: String,
      bucket: String,
      XAmzAlgorithm: String,
      XAmzCredential: String,
      XAmzDate: String,
      Policy: String,
      XAmzSignature: String,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const TempS3 = mongoose.models.TempS3 || mongoose.model('TempS3', tempS3Schema);
module.exports = TempS3;
