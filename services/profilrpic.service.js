import { Profile } from 'models';

export async function getProfileById(id, options = {}) {
  const profile = await Profile.findById(id, options.projection, options);
  return profile;
}

export async function getOne(query, options = {}) {
  const profile = await Profile.findOne(query, options.projection, options);
  return profile;
}

export async function getprofileList(filter, options = {}) {
  const profile = await Profile.find(filter, options.projection, options);
  return profile;
}

export async function getProfileListWithPagination(filter, options = {}) {
  const profile = await Profile.paginate(filter, options);
  return profile;
}

export async function createProfile(body = {}) {
  const profile = await Profile.create(body);
  return profile;
}

export async function updateProfile(filter, body, options = {}) {
  const profile = await Profile.findOneAndUpdate(filter, body, options);
  return profile;
}

export async function updateManyProfile(filter, body, options = {}) {
  const profile = await Profile.updateMany(filter, body, options);
  return profile;
}

export async function removeProfile(filter) {
  const profile = await Profile.findOneAndRemove(filter);
  return profile;
}

export async function removeManyProfile(filter) {
  const profile = await Profile.deleteMany(filter);
  return profile;
}
