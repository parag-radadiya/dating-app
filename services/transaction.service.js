import { Transaction } from '../models';
import enumModel from '../models/enum.model';

export async function getTransactionById(id, options = {}) {
  const transaction = await Transaction.findById(id, options.projection, options);
  return transaction;
}

export async function getOne(query, options = {}) {
  const transaction = await Transaction.findOne(query, options.projection, options);
  return transaction;
}

export async function getTransactionList(filter, options = {}) {
  const transaction = await Transaction.find(filter, options.projection, options);
  return transaction;
}

export async function getTransactionListWithPagination(filter, options = {}) {
  const transaction = await Transaction.paginate(filter, options);
  return transaction;
}

export async function createTransaction(body = {}) {
  const transaction = await Transaction.create(body);
  return transaction;
}

export async function updateTransaction(filter, body, options = {}) {
  const transaction = await Transaction.findOneAndUpdate(filter, body, options);
  return transaction;
}

export async function submitWithdrawalRequest() {
  const getWithdrawalRequest = await Transaction.find({
    status: enumModel.EnumTransactionType.SUBMIT_WITHDRAWAL_REQUEST,
  });
  return getWithdrawalRequest;
}
