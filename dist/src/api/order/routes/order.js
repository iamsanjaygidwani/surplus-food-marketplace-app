"use strict";
/**
 * order router
 */
Object.defineProperty(exports, "__esModule", { value: true });
// export default factories.createCoreRouter('api::order.order');
exports.default = {
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
