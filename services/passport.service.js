// import passport from 'passport';
// import config from 'config/config';
// import FacebookTokenStrategy from 'passport-facebook-token';
// import { Strategy as GoogleStrategy } from 'passport-token-google2';
// import { Strategy as AppleTokenStrategy } from 'passport-apple-verify-token';
// import { Strategy as GitHubStrategy } from 'passport-github2';
// import { authService } from 'services';
// /**
//  * we are calling this function since we need to register this in the passport Service so that in auth route it can find the appropriate strategy
//  * */
// module.exports = (function () {
//   passport.use(
//     new FacebookTokenStrategy(
//       {
//         clientID: config.facebook.clientID,
//         clientSecret: config.facebook.clientSecret,
//         fbGraphVersion: 'v3.0',
//         passReqToCallback: true,
//       },
//       function (accessToken, refreshToken, profile, done) {
//         authService
//           .createSocialUser(accessToken, refreshToken, profile, 'facebook')
//           .then((user) => done(null, user))
//           .catch((err) => done(err, null));
//       }
//     )
//   );
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: config.google.clientID,
//         clientSecret: config.google.clientSecret,
//       },
//       function (accessToken, refreshToken, profile, done) {
//         authService
//           .createSocialUser(accessToken, refreshToken, profile, 'google')
//           .then((user) => done(null, user))
//           .catch((err) => done(err, null));
//       }
//     )
//   );
//   passport.use(
//     new AppleTokenStrategy(
//       {
//         clientId: config.apple.clientID,
//         teamID: config.apple.teamID,
//         keyID: config.apple.keyId,
//         appleIdKeysUrl: 'https://appleid.apple.com/auth/keys',
//         passReqToCallback: true,
//         appleIssuer: 'https://appleid.apple.com',
//       },
//       function (profile, accessToken, done) {
//         authService
//           .createSocialUser(accessToken, '', profile, 'apple')
//           .then((user) => done(null, user))
//           .catch((err) => done(err, null));
//       }
//     )
//   );
//   passport.use(
//     new GitHubStrategy(
//       {
//         clientID: config.github.clientID,
//         clientSecret: config.github.clientSecret,
//         // here we use scope to fetch email from user's gitHub profile.
//         // so don't be smart and don't remove this. also since sometime we don't get the email so we have intentionally set below options
//         scope: ['user:email'],
//         // here userEmailUrl is used for fetch public email form user's gitHub profile.
//         userEmailURL: 'https://api.github.com/user/public_emails',
//       },
//       function (accessToken, refreshToken, profile, done) {
//         authService
//           .createSocialUser(accessToken, refreshToken, profile, 'github')
//           .then((user) => done(null, user))
//           .catch((err) => done(err, null));
//       }
//     )
//   );
// })();
