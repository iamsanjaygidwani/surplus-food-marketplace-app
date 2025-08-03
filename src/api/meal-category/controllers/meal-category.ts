/**
 * meal-category controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::meal-category.meal-category', ({ strapi }) => ({
  async listCategories(ctx) {
    try {
      const page = parseInt(ctx.query.page as string) || 1;
      const pageSize = parseInt(ctx.query.pageSize as string) || 10;
      const offset = (page - 1) * pageSize;

      const populateMeals = ctx.query.populateMeals === 'true';

      const [categories, total] = await Promise.all([
        strapi.db.query('api::meal-category.meal-category').findMany({
          populate: populateMeals ? ['meals'] : [],
          offset,
          limit: pageSize,
          orderBy: { createdAt: 'DESC' },
        }),
        strapi.db.query('api::meal-category.meal-category').count(),
      ]);

      ctx.send({
        data: categories,
        meta: {
          pagination: {
            total,
            page,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
          },
        },
      });
    } catch (err) {
      strapi.log.error('Failed to fetch meal categories:', err);
      ctx.throw(500, 'Unable to retrieve meal categories');
    }
  },
}));
