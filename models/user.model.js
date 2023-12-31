import mongoose from 'mongoose';
import mongoosePaginateV2 from 'mongoose-paginate-v2';
import { toJSON } from 'models/plugins';
import enumModel from 'models/enum.model';
import bcrypt from 'bcryptjs';

const CodeSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  expirationDate: {
    type: Date,
  },
  used: {
    type: Boolean,
  },
  codeType: {
    type: String,
    enum: Object.values(enumModel.EnumCodeTypeOfCode),
  },
});

const OauthSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  token: {
    type: String,
  },
});

const DeviceTokenSchema = new mongoose.Schema({
  /**
   *Device Token Of User
   * */
  deviceToken: {
    type: String,
  },
  /**
   *Platform of User
   * */
  platform: {
    type: String,
    enum: Object.values(enumModel.EnumPlatformOfDeviceToken),
  },
});
const UserSchema = new mongoose.Schema({
  /**
   * Name of User
   * */
  name: {
    type: String,
  },
  /**
   * Email address of User
   * */
  email: {
    type: String,
    // eslint-disable-next-line security/detect-unsafe-regex
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  },
  /**
   * For email verification
   * */
  emailVerified: {
    type: Boolean,
    private: true,
  },
  /**
   * For availableForMeet
   * */
  availableForMeet: {
    type: Boolean,
    default: true,
  },
  /**
   * role
   * */
  role: {
    type: String,
    enum: Object.values(enumModel.EnumRoleOfUser),
    default: enumModel.EnumRoleOfUser.USER,
  },
  userRegistered: {
    type: Boolean,
  },
  /**
   * custom server authentication
   * */
  codes: {
    type: [CodeSchema],
  },
  /**
   * password for authentication
   * */
  password: {
    type: String,
    private: true,
  },
  nickName: {
    type: String,
  },
  dateOfBirth: {
    type: String,
  },
  mobileNumber: {
    type: Number,
  },
  gender: {
    type: String,
  },
  isUserOnline: {
    type: Boolean,
  },
  /**
   * facebook based authentication
   * */
  facebookProvider: {
    type: OauthSchema,
  },
  /**
   * Google based authentication
   * */
  googleProvider: {
    type: OauthSchema,
  },
  /**
   * apple based authentication
   * */
  appleProvider: {
    type: OauthSchema,
  },
  /**
   * To store device tokens
   * */
  deviceTokens: {
    type: [DeviceTokenSchema],
  },
  profileImage: {
    type: String,
  },
  /**
   * GitHub based authentication
   * */
  githubProvider: {
    type: OauthSchema,
  },
});
UserSchema.plugin(toJSON);
UserSchema.plugin(mongoosePaginateV2);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the User to be excluded
 * @returns Promise with boolean value
 */
UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const User = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!User;
};
UserSchema.pre('save', async function (next) {
  const User = this;
  if (User.isModified('password')) {
    User.password = await bcrypt.hash(User.password, 8);
  }
  next();
});
/**
 * When user reset password or change password then it save in bcrypt format
 */
UserSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate(); // {password: "..."}
  if (update && update.password) {
    const passwordHash = await bcrypt.hash(update.password, 10);
    this.setUpdate({
      $set: {
        password: passwordHash,
      },
    });
  }
  next();
});
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema, 'User');
module.exports = UserModel;
