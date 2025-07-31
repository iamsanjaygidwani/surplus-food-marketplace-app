/**
 * order controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
    async recent(ctx) {
        try {
            const now = new Date();
            const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

            const entries = await strapi.db.query('api::order.order').findMany({
                where: {
                    createdAt: {
                        $gte: fortyEightHoursAgo.toISOString(),
                    },
                    order_status: {
                        $ne: 'timeout'
                    }
                },
                orderBy: { createdAt: 'DESC' },
            });

            return { data: entries };
        } catch (err) {
            ctx.throw(500, err);
        }
    },

    async history(ctx) {
        try {
            const now = new Date();
            const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));

            const entries = await strapi.db.query('api::order.order').findMany({
                where: {
                    createdAt: {
                        $lt: fortyEightHoursAgo.toISOString(),
                    },
                    order_status: {
                        $ne: 'timeout'
                    }
                },
                orderBy: { createdAt: 'DESC' },
            });

            return { data: entries };
        } catch (err) {
            ctx.throw(500, err);
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
