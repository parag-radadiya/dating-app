module.exports = {
  async up(db) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // const result = await db.collection('User').updateOne({ artist: 'The Beatles' }, { $set: { blacklisted: true } });

    await db.collection('User').find();
  },

  // async down(db, client) {
  // TODO write the statements to rollback your migration (if possible)
  // Example:
  // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  // },
};
