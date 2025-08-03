/**
 * meal-category router
 */

import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::meal-category.meal-category');

export default {
  routes: [
    {
      method: 'GET',
      path: '/meal-categories/custom-list',
      handler: 'meal-category.listCategories',
      config: {
        auth: false,
      },
    },
  ],
};
