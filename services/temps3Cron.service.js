import { deleteObjects } from 'services/s3.service';
import { TempS3, ErrorLog } from 'models';

const updateTempS3 = async () => {
  try {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() - 23);
    const tempObjects = await TempS3.find({ active: false, createdAt: { $lt: currentDate } }, { active: false });
    const keys = await tempObjects
      .filter((tmp) => tmp.key)
      .map((tmp) => {
        return {
          Key: tmp.key,
        };
      });
    if (keys.length > 0) {
      await deleteObjects(keys);
      await TempS3.updateMany({ active: false, createdAt: { $lt: currentDate } }, { active: false });
    }
  } catch (err) {
    await ErrorLog.create({
      type: 'cron',
      error: JSON.stringify(err),
    });
  }
};
module.exports = {
  updateTempS3,
};
