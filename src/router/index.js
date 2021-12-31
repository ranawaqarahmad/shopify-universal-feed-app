import Vue from "vue";
import VueRouter from "vue-router";
import Store from "../store/index";
// import { BACKEND_URL } from "@/config/index";


Vue.use(VueRouter);

const routes = [
  {
    path:'',
    component:() => import('@/layout/default-layout.vue'),
    children:[
      {
        path: "/",
        name: "Home",
        component: () =>
          import(/* webpackChunkName: "plans" */ "../views/Home.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/plans",
        name: "plans",
        component: () =>
          import(/* webpackChunkName: "plans" */ "../views/Plans.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/create-feed",
        name: "create-feed",
        component: () =>
          import(/* webpackChunkName: "create-feed" */ "../views/feed/CreateFeed.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/edit-setting",
        name: "edit-setting",
        component: () =>
          import(/* webpackChunkName: "edit-setting" */ "../views/EditSetting.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path:'/edit-feed/:id',
        name: "edit-feed",
        component: () =>
          import(/* webpackChunkName: "edit-feed" */ "../views/feed/CreateFeed.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path:'/edit-google',
        name: "edit-google",
        component: () =>
          import(/* webpackChunkName: "edit-google" */ "../views/google/EditGoogle.vue"),
        meta: {
          requiresAuth: true,
        },
      }
    ]
  },

  // =================================================
  // =============BLANK PAGES LAYOUT=================
  // ================================================
  {
    path:'',
    name:"blank-layout",
    component:() => import('@/layout/blank-layout.vue'),
    children:[
      {
        path: "/not-authorize",
        name: "not-authorize",
        component: () =>
          import(/* webpackChunkName: "not-authorize" */ "../views/NotAuthorize.vue"),
        meta: {
          requiresAuth: false,
        },
      },
      {
        path: "*",
        name: "error",
        component: () =>
          import(/* webpackChunkName: "error" */ "../views/Error.vue"),
        meta: {
          requiresAuth: true,
        },
      },
    ]
  },
  

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  try {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    const { token, shop } = to.query;
    if (token) localStorage.setItem("token", token);
    if (shop) localStorage.setItem("shop", shop);

    const tokenExist = localStorage.getItem("token");
    let isAuthenticated = false;

    if (tokenExist) {
      isAuthenticated = true;
      if (!Store.state.shop) await Store.dispatch("FETCH_SHOP_DETAILS");
    } 

    if (requiresAuth && isAuthenticated) {
      next();
    } else if (requiresAuth && !isAuthenticated) {
      next("/not-authorize");
    } else if (!requiresAuth && isAuthenticated) {
      next("/");
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
