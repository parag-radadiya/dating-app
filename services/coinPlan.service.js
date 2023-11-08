import { CoinPlanModel } from '../models';

export async function getCoinPlanById(id, options = {}) {
  const coinPlan = await CoinPlanModel.findById(id, options.projection, options);
  return coinPlan;
}

export async function getOne(query, options = {}) {
  const coinPlan = await CoinPlanModel.findOne(query, options.projection, options);
  return coinPlan;
}

export async function getCoinPlanList(filter, options = {}) {
  const coinPlan = await CoinPlanModel.find(filter, options.projection, options);
  return coinPlan;
}

export async function getCoinPlanListWithPagination(filter, options = {}) {
  const coinPlan = await CoinPlanModel.paginate(filter, options);
  return coinPlan;
}

export async function createCoinPlan(body = {}) {
  const coinPlan = await CoinPlanModel.create(body);
  return coinPlan;
}

export async function updateCoinPlan(filter, body, options = {}) {
  const coinPlan = await CoinPlanModel.findOneAndUpdate(filter, body, options);
  return coinPlan;
}
