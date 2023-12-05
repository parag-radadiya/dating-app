import httpStatus from 'http-status';
import { profileService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { pick } from '../../utils/pick';

export const get = catchAsync(async (req, res) => {
  const { profileId } = req.params;
  const filter = {
    _id: profileId,
  };
  const options = {};
  const profile = await profileService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: profile });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const profile = await profileService.getprofileList(filter, options);
  return res.status(httpStatus.OK).send({ results: profile });
});

export const paginate = catchAsync(async (req, res) => {
  const { query } = req;
  const sortingObj = pick(query, ['sort', 'order']);
  const sortObj = {
    [sortingObj.sort]: sortingObj.order,
  };
  const filter = {};
  const options = {
    sort: sortObj,
    ...pick(query, ['limit', 'page']),
  };
  const profile = await profileService.getProfileListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: profile });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  // body.createdBy = req.user;
  const profile = await profileService.createProfile(body);
  return res.status(httpStatus.CREATED).send({ results: profile });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { profileId } = req.params;
  const filter = {
    _id: profileId,
  };
  const options = { new: true };
  const profile = await profileService.updateprofile(filter, body, options);
  return res.status(httpStatus.OK).send({ results: profile });
});

export const remove = catchAsync(async (req, res) => {
  const { profileId } = req.params;
  const filter = {
    _id: profileId,
  };
  const profile = await profileService.removeprofile(filter);
  return res.status(httpStatus.OK).send({ results: profile });
});
