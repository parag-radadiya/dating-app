// import Queue from 'bull';
// import Redis from 'ioredis';
// import config from 'config/config';
//
// const redisConfig = {
//   port: config.redis.port, // Redis port
//   host: config.redis.host, // Redis host
//   // password: config.redis.password,
// };
// const defaultQueueClient = new Redis(redisConfig);
// const opts = {
//   createClient(type) {
//     switch (type) {
//       case 'defaultQueueClient':
//         return defaultQueueClient;
//       default:
//         return new Redis(redisConfig);
//     }
//   },
// };
// const defaultQueue = new Queue('defaultQueueClient', opts);
// const addDefaultQueue = (queueData) => {
//   const options = {
//     attempts: 1,
//   };
//   defaultQueue.add(queueData, options);
// };
// defaultQueue.process(async (job, done) => {
//   done();
// });
// module.exports = {
//   addDefaultQueue,
// };
