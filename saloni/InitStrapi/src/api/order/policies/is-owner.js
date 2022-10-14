'use strict';
const utils = require('@strapi/utils')
const {PolicyError} = utils.errors
/**
 * `is-owner` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
    const {id} = policyContext.request.params;
    const user = policyContext.state.user;
    const order = await strapi.entityService.findOne("api::order.order", id, {
      populate : ["owner"]
    });
    if(user.id == order.owner.id){
      return true;
    }
    throw new PolicyError("confirmation order denied: not owner")
};
