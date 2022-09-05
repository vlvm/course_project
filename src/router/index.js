import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push;
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
VueRouter.prototype.replace = function replace(location) {
  return originalPush.call(this, location).catch((err) => err);
};
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  // 课程模块
  {
    path: "/course",
    name: "course",
    meta: {
      moduleName: "course",
    },
    redirect: "/course/created",
    // component: () =>
    //   import(/* webpackChunkName: "course" */ "../views/layout/index"),
    component: () =>
      import(/* webpackChunkName: "course" */ "../views/course/Course"),
    children: [
      {
        path: "/course/created",
        name: "created",
        meta: {
          moduleName: "course",
        },
        component: () =>
          import(
            /* webpackChunkName: "course" */ "../views/course/created/created"
          ),
      },
      {
        path: "/course/processing",
        name: "processing",
        meta: {
          moduleName: "course",
        },
        component: () =>
          import(
            /* webpackChunkName: "course" */ "../views/course/processing/Processing"
          ),
      },
      {
        path: "/course/result",
        name: "result",
        meta: {
          moduleName: "course",
        },
        component: () =>
          import(
            /* webpackChunkName: "course" */ "../views/course/result/result"
          ),
      },
    ],
  },
  // 考试模块
  {
    path: "/exam",
    name: "exam",
    meta: {
      moduleName: "exam",
    },
    redirect: "/exam/created",
    component: () =>
      import(/* webpackChunkName: "exam" */ "../views/exam/Exam"),
    children: [
      {
        path: "/exam/created",
        name: "created",
        meta: {
          moduleName: "exam",
        },
        component: () =>
          import(/* webpackChunkName: "exam" */ "../views/exam/created/Index"),
      },
      {
        path: "/exam/processing",
        name: "processing",
        meta: {
          moduleName: "exam",
        },
        component: () =>
          import(
            /* webpackChunkName: "exam" */ "../views/exam/processing/Index"
          ),
      },
      {
        path: "/exam/result",
        name: "result",
        meta: {
          moduleName: "exam",
        },
        component: () =>
          import(/* webpackChunkName: "exam" */ "../views/exam/result/Index"),
      },
    ],
  },
  // Ai 模块
  {
    path: "/ai",
    name: "ai",
    meta: {
      moduleName: "ai",
    },
    component: () => import(/* webpackChunkName: "ai" */ "../views/ai/Ai"),
  },
  // 设置模块
  {
    path: "/settings",
    name: "settings",
    meta: {
      moduleName: "settings",
    },
    redirect: "/settings/userInfo",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/setting/Setting"),
    children: [
      {
        path: "/settings/userInfo",
        name: "userInfo",
        meta: {
          moduleName: "settings",
        },
        component: () =>
          import(
            /* webpackChunkName: "settings" */ "../views/setting/subPage/UserInfo"
          ),
      },
      {
        path: "/settings/stuGroup",
        name: "stuGroup",
        meta: {
          moduleName: "settings",
        },
        component: () =>
          import(
            /* webpackChunkName: "settings" */ "../views/setting/subPage/StuGroup"
          ),
      },
      {
        path: "/settings/stuRoster",
        name: "stuRoster",
        meta: {
          moduleName: "settings",
        },
        component: () =>
          import(
            /* webpackChunkName: "settings" */ "../views/setting/subPage/StuRoster"
          ),
      },
      {
        path: "/settings/teacherList",
        name: "teacherList",
        meta: {
          moduleName: "settings",
        },
        component: () =>
          import(
            /* webpackChunkName: "settings" */ "../views/setting/subPage/TeacherList"
          ),
      },
      {
        path: "/settings/tagTree",
        name: "tagTree",
        meta: {
          moduleName: "settings",
        },
        component: () =>
          import(
            /* webpackChunkName: "settings" */ "../views/setting/subPage/TagTree"
          ),
      },
    ],
  },
  // 登录模块
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login/Login"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login/Register"),
  },
  {
    path: "/retrieve",
    name: "retrieve",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login/Retrieve"),
  },
  // 批阅模块
  {
    path: "/review",
    name: "review",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/review/Review"),
  },
  // 测试页
  {
    path: "/test",
    name: "test",
    component: () =>
      import(/* webpackChunkName: "test" */ "../views/course/Course"),
    children: [
      {
        path: "/test/created",
        name: "created",
        meta: {
          moduleName: "course",
        },
        component: () =>
          import(
            /* webpackChunkName: "test" */ "../views/course/created/created"
          ),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
