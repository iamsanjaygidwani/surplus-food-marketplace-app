/**
 * order controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async recent(ctx) {
        try {
            const now = new Date();
            const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

            const page = parseInt(ctx.query.page as string) || 1;
            const pageSize = parseInt(ctx.query.pageSize as string) || 10;
            const offset = (page - 1) * pageSize;

            const [entries, total] = await Promise.all([
                strapi.db.query('api::order.order').findMany({
                    where: {
                        createdAt: {
                            $gte: fortyEightHoursAgo.toISOString(),
                        },
                        order_status: { $ne: 'timeout' },
                    },
                    orderBy: { createdAt: 'DESC' },
                    offset,
                    limit: pageSize,
                }),
                strapi.db.query('api::order.order').count({
                    where: {
                        createdAt: {
                            $gte: fortyEightHoursAgo.toISOString(),
                        },
                        order_status: { $ne: 'timeout' },
                    },
                }),
            ]);

            return {
                data: entries,
                meta: {
                    pagination: {
                        total,
                        page,
                        pageSize,
                        pageCount: Math.ceil(total / pageSize),
                    },
                },
            };
        } catch (err) {
            console.error('Error in recent orders:', err);
            ctx.throw(500, 'Failed to fetch recent orders');
        }
    },

    async history(ctx) {
        try {
            const page = parseInt(ctx.query.page as string) || 1;
            const pageSize = parseInt(ctx.query.pageSize as string) || 10;
            const offset = (page - 1) * pageSize;

            const [entries, total] = await Promise.all([
                strapi.db.query('api::order.order').findMany({
                    orderBy: { createdAt: 'DESC' },
                    offset,
                    limit: pageSize,
                }),
                strapi.db.query('api::order.order').count(),
            ]);

            return {
                data: entries,
                meta: {
                    pagination: {
                        total,
                        page,
                        pageSize,
                        pageCount: Math.ceil(total / pageSize),
                    },
                },
            };
        } catch (err) {
            console.error('Error in order history:', err);
            ctx.throw(500, 'Failed to fetch order history');
        }
    },

    async createFromCart(ctx) {
        try {
            const userId = ctx.state.user.id;
            const order = await strapi.service('api::cart.cart').createOrderFromCart(userId);
            return { data: order };
        } catch (error) {
            return ctx.badRequest(error.message);
        }
    }
}));
