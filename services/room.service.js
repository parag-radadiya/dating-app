import { Room } from 'models';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

export async function getRoomById(id, options = {}) {
  const room = await Room.findById(id, options.projection, options);
  return room;
}

export async function getOne(query, options = {}) {
  const room = await Room.findOne(query, options.projection, options);
  return room;
}

export async function getRoomList(filter, options = {}) {
  const room = await Room.find(filter, options.projection, options);
  return room;
}

export async function getRoomListWithPagination(filter, options = {}) {
  const room = await Room.paginate(filter, options);
  return room;
}

export async function createRoom(body = {}) {
  const room = await Room.create(body);
  return room;
}

export async function updateRoom(filter, body, options = {}) {
  const room = await Room.findOneAndUpdate(filter, body, options);
  return room;
}

export async function updateManyRoom(filter, body, options = {}) {
  const room = await Room.updateMany(filter, body, options);
  return room;
}

export async function removeRoom(filter) {
  const room = await Room.findOneAndRemove(filter);
  return room;
}

export async function removeManyRoom(filter) {
  const room = await Room.deleteMany(filter);
  return room;
}

export async function isRoomPresent(roomId) {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
  }
  return room;
}

export async function getUserBySocketId(params) {
  const { roomId, socketId } = params;
  return getOne({ _id: roomId, socketId });
}
