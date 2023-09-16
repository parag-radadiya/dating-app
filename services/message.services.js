import { Message } from 'models';

export async function getMessageById(id, options = {}) {
  const message = await Message.findById(id, options.projection, options);
  return message;
}

export async function getOne(query, options = {}) {
  const message = await Message.findOne(query, options.projection, options);
  return message;
}

export async function getMessageList(filter, options = {}) {
  const message = await Message.find(filter, options.projection, options);
  return message;
}

export async function createMessage(body = {}) {
  const message = await Message.create(body);
  return message;
}
