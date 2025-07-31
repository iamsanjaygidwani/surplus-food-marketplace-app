"use strict";
/**
 * meal service
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
const node_cron_1 = __importDefault(require("node-cron"));
exports.default = strapi_1.factories.createCoreService('api::meal.meal', ({ strapi }) => ({
    async createRecurringStockEvents() {
        try {
            // Find all meals with recurring_stock
            const meals = await strapi.db.query('api::meal.meal').findMany({
                where: {
                    recurring_stock: {
                        $gt: 0
                    }
                }
            });
            // Create stock events for each meal
            for (const meal of meals) {
                await strapi.entityService.create('api::stock-event.stock-event', {
                    data: {
                        meal: meal.id,
                        quantity: meal.recurring_stock,
                        type: 'INCREMENT',
                        event_source: 'store',
                        event_time: new Date(),
                        publishedAt: new Date()
                    }
                });
            }
        }
        catch (error) {
            console.error('Error creating recurring stock events:', error);
        }
    },
    async bootstrap() {
        // Schedule the job to run at midnight (00:00)
        node_cron_1.default.schedule('0 0 * * *', async () => {
            await this.createRecurringStockEvents();
        });
    }
}));
