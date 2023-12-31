import stripeFun from 'stripe';
import { formatUSD, formatStripeAmount } from 'utils/format-number';
import config from 'config/config';

const stripe = stripeFun(config.stripe.key);
export const getAllProductsAndPlans = () => {
  return Promise.all([stripe.products.list({}), stripe.plans.list({})]).then((stripeData) => {
    const products = stripeData[0].data;
    let plans = stripeData[1].data;
    plans = plans
      .sort((a, b) => {
        return a.amount - b.amount;
      })
      .map((plan) => {
        /* Format plan price (amount) */
        const amount = formatUSD(plan.amount);
        return { ...plan, amount };
      });
    products.forEach((product) => {
      const filteredPlans = plans.filter((plan) => {
        return plan.product === product.id;
      });
      // eslint-disable-next-line no-param-reassign
      product.plans = filteredPlans;
    });
    return products;
  });
};

export const createProduct = (requestBody) => {
  return stripe.products.create({
    name: requestBody.productName,
    type: 'service',
  });
};

export const createPlan = (requestBody) => {
  return stripe.plans.create({
    nickname: requestBody.planName,
    amount: formatStripeAmount(requestBody.planAmount),
    interval: requestBody.planInterval,
    interval_count: +requestBody.planIntervalNumber,
    product: requestBody.productId,
    currency: 'USD',
  });
};

export const createSubscription = (customerId, requestBody) => {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        plan: requestBody.planId,
      },
    ],
  });
};

export const createCustomer = async (email, metadata = {}) => {
  return stripe.customers.create({
    email,
    metadata,
  });
};

export const createPaymentMethodFromToken = async (customerId, token, defaultMethod = false) => {
  return stripe.paymentMethods
    .create({
      type: 'card',
      card: {
        token,
      },
    })
    .then((method) => {
      return stripe.paymentMethods.attach(method.id, { customer: customerId });
    })
    .then((method) => {
      if (defaultMethod) {
        return stripe.customers.update(customerId, {
          invoice_settings: { default_payment_method: method.id },
        });
      }
      return method;
    });
};

export const cancelPaymentSubscription = async (subscriptionId) => {
  return stripe.subscriptions.del(subscriptionId);
};

export const createChargeFromCard = async (amount, paymentMethod, customerId) => {
  return stripe.paymentIntents.create({
    amount: formatStripeAmount(amount),
    currency: 'usd',
    customer: customerId,
    payment_method_types: ['card'],
    payment_method: paymentMethod,
    confirm: true,
  });
};
