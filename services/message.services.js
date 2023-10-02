import { Message } from 'models';

export async function getMessageById(id, options = {}) {
  const message = await Message.findById(id, options.projection, options);
  return message;
}

export async function getOne(query, options = {}) {
  const message = await Message.findOne(query, options.projection, options);
  return message;
}

export async function getLastHundreadMessageList(filter, options = {}) {
  const message = await Message.find(filter, options.projection, options).sort({ createdAt: 1 }).limit(100);
  return message;
}

export async function createMessage(body = {}) {
  const message = await Message.create(body);
  return message;
}
export async function updateMessage(filter, body, options = {}) {
  const message = await Message.findOneAndUpdate(filter, body, options);
  return message;
}
