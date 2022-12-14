'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order',
({strapi}) => ({
    confirmOrder: async (ctx, next) => {
        const {id} = ctx.request.params;
        const user = ctx.state.user;
        await strapi.entityService.update("api::order.order", id, {
            data : {
                confirmed : true,
                confirmation_date : new Date()
            }
        });
        return {message : "confirmed"};
    },
    async create(ctx, next) {
        const { products } = ctx.request.body.data;
        const user = ctx.state.user;
        const order = await strapi.entityService.create("api::order.order", {
            data : {
                products,
                owner : user.id
            }
        });
        strapi.service("api::order.order").sendEmail(order.id, ctx.state.user);
        return { order };
    }
})
);
