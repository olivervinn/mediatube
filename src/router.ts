import Vue from "vue";
import Router from "vue-router";
import Config from "./config";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      component: () => import("./views/Login.vue"),
      meta: {
        metaTags: {},
        auth: false
      }
    },
    {
      name: "error",
      path: "/error",
      component: () => import("./views/Login.vue"),
      meta: {
        metaTags: {},
        auth: false
      },
      props: true
    },
    {
      path: "/browse",
      component: () => import("./views/Browser.vue"),
      children: [
        {
          name: "preview",
          path: ":id",
          component: () => import("./views/BrowseVideos.vue"),
          meta: {
            metaTags: {},
            auth: true
          },
          props: true
        },
        {
          path: "",
          component: () => import("./views/BrowseCatalog.vue"),
          meta: {
            metaTags: {},
            auth: true
          }
        }
      ]
    },
    {
      path: "/play",
      component: () => import("./views/Browser.vue"),
      children: [
        {
          path: ":id",
          props: true,
          name: "play",
          component: () => import("./views/VideoPlayer.vue"),
          meta: {
            metaTags: {},
            auth: true
          }
        }
      ]
    },
    {
      path: "*",
      redirect: "/login"
    }
  ]
});

router.afterEach((to, from) => {
  document.title = to.meta.title || document.title;
});

export default router;
