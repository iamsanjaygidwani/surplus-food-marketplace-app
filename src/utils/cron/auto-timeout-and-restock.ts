export async function autoTimeoutAndRestock(strapi: any) {
    strapi.log.info('🔄 Running cron job...');

    const now = new Date();
    const staleThreshold = new Date(now.getTime() - 15 * 60 * 1000);

    const staleOrders = await strapi.db.query('api::order.order').findMany({
        where: {
            order_status: 'created',
            payment_status: 'pending',
            createdAt: {
                $lt: staleThreshold.toISOString(),
            },
        },
        populate: ['order_items'],
    });

    for (const order of staleOrders) {
        // restore stock of items
        for (const item of order.order_items || []) {
            const meal = await strapi.db.query('api::meal.meal').findOne({
                where: { id: item.meal_id },
                select: ['recurring_stock'],
            })

            if (meal) {
                await strapi.db.query('api::meal.meal').update({
                    where: { id: item.meal_id },
                    data: { recurring_stock: meal.recurring_stock + item.quantity },
                });
            }
        }

        // update order details
        await strapi.db.query('api::order.order').update({
            where: { id: order.id },
            data: {
                order_status: 'timeout',
                payment_status: 'failed',
            },
        });

        strapi.log.info(
            `Order #${order.order_number} marked as timeout. Stock restored.`
        );
    }
}
