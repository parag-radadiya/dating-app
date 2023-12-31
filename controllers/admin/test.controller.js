import httpStatus from 'http-status';
import { testService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { pick } from '../../utils/pick';

export const get = catchAsync(async (req, res) => {
  const { testId } = req.params;
  const filter = {
    _id: testId,
  };
  const options = {};
  const test = await testService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: test });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const test = await testService.getTestList(filter, options);
  return res.status(httpStatus.OK).send({ results: test });
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
  const test = await testService.getTestListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: test });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  body.createdBy = req.user;
  body.updatedBy = req.user;
  const options = {};
  const test = await testService.createTest(body, options);
  return res.status(httpStatus.CREATED).send({ results: test });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { testId } = req.params;
  const filter = {
    _id: testId,
  };
  const options = { new: true };
  const test = await testService.updateTest(filter, body, options);
  return res.status(httpStatus.OK).send({ results: test });
});

export const remove = catchAsync(async (req, res) => {
  const { testId } = req.params;
  const filter = {
    _id: testId,
  };
  const test = await testService.removeTest(filter);
  return res.status(httpStatus.OK).send({ results: test });
});
