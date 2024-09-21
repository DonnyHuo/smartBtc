import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import HomeView from "../views/HomeView/index.vue";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/swap",
    name: "swap",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SwapView/index.vue"),
  },
  {
    path: "/options",
    name: "options",
    redirect: "/options/trade",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/OptionsView/index.vue"),
    children: [
      {
        path: "trade",
        name: "trade",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../views/OptionsView/Trade/index.vue"
          ),
      },
      {
        path: "pool",
        name: "pool",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../views/OptionsView/Pool/index.vue"
          ),
      },
    ],
  },
  {
    path: "/public",
    name: "public",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/OptionsView/Pool/public.vue"
      ),
  },
  {
    path: "/private",
    name: "private",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/OptionsView/Pool/private.vue"
      ),
  },

  {
    path: "/lp",
    name: "lp",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LpView/index.vue"),
  },
  {
    path: "/lpDetail",
    name: "lpDetail",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LpView/LpDetail.vue"),
  },
  {
    path: "/share",
    name: "share",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ShareView/index.vue"),
  },
  {
    path: "/partner",
    name: "partnerList",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/ShareView/partnerList.vue"
      ),
  },
  {
    path: "/withdraw",
    name: "withdraw",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Withdraw/index.vue"),
  },
  {
    path: "/btcSwap",
    name: "btcSwap",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/BtcSwap/index.vue"),
  },
  {
    path: "/lpSwap",
    name: "lpSwap",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LpSwap/index.vue"),
  },
  {
    path: "/lpSwapDetail",
    name: "lpSwapDetail",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LpSwap/detail.vue"),
  },
  {
    path: "/kol",
    name: "kol",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Kol/index.vue"),
  },
  {
    path: "/kolAdd",
    name: "kolAdd",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Kol/add.vue"),
  },
  {
    path: "/review",
    name: "review",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Review/index.vue"),
  },
  {
    path: "/voting",
    name: "voting",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Voting/index.vue"),
  },
];

const adminAddress = store.state.adminAddress;
const address = store.state.address.toLowerCase();

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path == "/review") {
    if (adminAddress.includes(address)) {
      next();
    } else {
      next({ name: "home" });
    }
  }
  document.getElementsByClassName("contentView")[0].scrollTop = 0;
  next();
});

export default router;
