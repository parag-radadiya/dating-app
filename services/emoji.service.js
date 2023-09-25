import { Emoji } from 'models';

export async function getEmojiById(id, options = {}) {
  const emoji = await Emoji.findById(id, options.projection, options);
  return emoji;
}

export async function getOne(query, options = {}) {
  const emoji = await Emoji.findOne(query, options.projection, options);
  return emoji;
}

export async function getEmojiList(filter, options = {}) {
  const emoji = await Emoji.find(filter, options.projection, options);
  return emoji;
}

export async function getEmojiListWithPagination(filter, options = {}) {
  const emoji = await Emoji.paginate(filter, options);
  return emoji;
}

export async function createEmoji(body = {}) {
  const emoji = await Emoji.create(body);
  return emoji;
}

export async function updateEmoji(filter, body, options = {}) {
  const emoji = await Emoji.findOneAndUpdate(filter, body, options);
  return emoji;
}

export async function updateManyEmoji(filter, body, options = {}) {
  const emoji = await Emoji.updateMany(filter, body, options);
  return emoji;
}

export async function removeEmoji(filter) {
  const emoji = await Emoji.findOneAndRemove(filter);
  return emoji;
}

export async function removeManyEmoji(filter) {
  const emoji = await Emoji.deleteMany(filter);
  return emoji;
}
