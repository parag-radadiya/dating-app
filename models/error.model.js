import mongoose from 'mongoose';

const { Schema } = mongoose;
const errorLogSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['cron'],
    },
    error: {
      type: String,
    },
  },
  { timestamps: true }
);
const ErrorLog = mongoose.models.ErrorLog || mongoose.model('ErrorLog', errorLogSchema);
module.exports = ErrorLog;
