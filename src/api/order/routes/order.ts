/**
 * order router
 */

import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::order.order');

export default {
  routes: [
    {
      method: 'GET',
      path: '/orders/recent',
      handler: 'order.recent',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/orders/history',
      handler: 'order.history',
      config: {
        auth: false,
      },
    },
  ],
};
