import axios from "@/axios/axios";



export default {
  async FETCH_SHOP_DETAILS({ commit }) {
    try {
      commit("SET_LOADING", { type: "app_loading", loading: true });
      const resp = await axios.get("fetch-shop");
      const { shop } = resp.data;
      commit("SET_SHOP", shop);
      commit("SET_LOADING", { type: "app_loading", loading: false });
    } catch (e) {
      commit("SET_LOADING", { type: "app_loading", loading: false });
    }
  },

  async FETCH_COLLECTIONS_SHOP({ commit , state }) {
    try {
      // do not fetch the collections if it is already fetched
      if (state.collections.length > 0) return;
      commit("SET_LOADING", { type: "collection_loading", loading: true });
      const resp = await axios.get("/shop-and-collections");
      const { collections, shopify_shop } = resp.data;
      commit("SET_SHOPIFY_SHOP", shopify_shop);
      commit("SET_COLLECTIONS", collections);
      commit("SET_LOADING", { type: "collection_loading", loading: false });
    } catch (error) {
      commit("SET_LOADING", { type: "collection_loading", loading: false });
      console.log(error);
    }
  },
};
