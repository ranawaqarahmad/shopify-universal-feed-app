export default {
    SET_SHOP(state , shop){
        state.shop = shop
      },
      SET_LOADING(state , {type , loading}){
        state.loading[type] = loading
      },
      SET_COLLECTIONS(state , collections){
        state.collections = collections
      },
      SET_SHOPIFY_SHOP(state , shop){
        state.shopify_shop = shop
      }
}