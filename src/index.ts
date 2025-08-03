import { autoTimeoutAndRestock } from './utils/cron/auto-timeout-and-restock';
// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // temp-testing: manually trigger recurring stock events on boot
    // await strapi.service('api::meal.meal').createRecurringStockEvents();

    strapi.cron.add({
      // runs every 5 minutes
      '*/5 * * * *': async () => {
        await autoTimeoutAndRestock(strapi);
      },
    });
  },
};
