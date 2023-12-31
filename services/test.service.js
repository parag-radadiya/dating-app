import { Test } from 'models';

export async function getTestById(id, options = {}) {
  const test = await Test.findById(id, options.projection, options);
  return test;
}

export async function getOne(query, options = {}) {
  const test = await Test.findOne(query, options.projection, options);
  return test;
}

export async function getTestList(filter, options = {}) {
  const test = await Test.find(filter, options.projection, options);
  return test;
}

export async function getTestListWithPagination(filter, options = {}) {
  const test = await Test.paginate(filter, options);
  return test;
}

export async function createTest(body = {}) {
  const test = await Test.create(body);
  return test;
}

export async function updateTest(filter, body, options = {}) {
  const test = await Test.findOneAndUpdate(filter, body, options);
  return test;
}

export async function updateManyTest(filter, body, options = {}) {
  const test = await Test.updateMany(filter, body, options);
  return test;
}

export async function removeTest(filter) {
  const test = await Test.findOneAndRemove(filter);
  return test;
}

export async function removeManyTest(filter) {
  const test = await Test.deleteMany(filter);
  return test;
}
