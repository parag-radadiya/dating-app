import httpStatus from 'http-status';
import { catchAsync } from 'utils/catchAsync';
import { s3Service } from 'services';
// eslint-disable-next-line import/prefer-default-export
export const preSignedPutUrl = catchAsync(async (req, res) => {
  const { body, user } = req;
  const s3PutObject = await s3Service.validateExtensionForPutObject(body, user);
  return res.status(httpStatus.OK).send({ results: s3PutObject });
});
