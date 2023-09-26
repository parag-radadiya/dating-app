import httpStatus from 'http-status';
import { emojiService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { pick } from '../../utils/pick';

export const get = catchAsync(async (req, res) => {
  const { emojiId } = req.params;
  const filter = {
    _id: emojiId,
  };
  const options = {};
  const emoji = await emojiService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: emoji });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const emoji = await emojiService.getEmojiList(filter, options);
  return res.status(httpStatus.OK).send({ results: emoji });
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
  const emoji = await emojiService.getEmojiListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: emoji });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  // body.createdBy = req.user;
  const emoji = await emojiService.createEmoji(body);
  return res.status(httpStatus.CREATED).send({ results: emoji });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { emojiId } = req.params;
  const filter = {
    _id: emojiId,
  };
  const options = { new: true };
  const emoji = await emojiService.updateEmoji(filter, body, options);
  return res.status(httpStatus.OK).send({ results: emoji });
});

export const remove = catchAsync(async (req, res) => {
  const { emojiId } = req.params;
  const filter = {
    _id: emojiId,
  };
  const emoji = await emojiService.removeEmoji(filter);
  return res.status(httpStatus.OK).send({ results: emoji });
});
