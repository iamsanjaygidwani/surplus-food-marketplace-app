export default {
  async beforeCreate(event: any) {
    const { data } = event.params;
    // console.log('Creating order with:', data);

    const orderNumber = data.order_number;
    
    // normalize the payload to avoid handling manually
    const storeId = 
      data.store?.connect?.[0]?.id || 
      data.store?.set?.[0]?.id || 
      data.store?.id || 
      data.store;

    if (!orderNumber || !storeId) return;

    const last4 = orderNumber.slice(-4);

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingOrders = await strapi.db.query('api::order.order').findMany({
      where: {
        store: {
          id: {
            $eq: storeId,
          },
        },
        createdAt: {
          $gte: startOfDay.toISOString(),
          $lte: endOfDay.toISOString(),
        },
      },
      select: ['order_number'],
    });

    const conflict = existingOrders.find(
      (o) => o.order_number?.slice(-4) === last4
    );

    if (conflict) {
      throw new Error(
        `Order number ending in '${last4}' already exists for this store today.`
      );
    }
  },
};
