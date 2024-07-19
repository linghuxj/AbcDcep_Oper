import Layout from "@/page/index/";

export default [{
    path: "/info",
    component: Layout,
    redirect: "/info/index",
    children: [{
      path: "index",
      name: "个人信息",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/user/user/info"),
    }, ],
  },
  {
    path: "/user",
    component: Layout,
    redirect: "/user/details",
    children: [{
      path: "details/:userId",
      name: "用户详情",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/user/user/details"),
    }, ],
  },
  // {
  //   path: "/user",
  //   component: Layout,
  //   redirect: "/user/details",
  //   children: [
  //     {
  //       path: "koldetail/:userId",
  //       name: "用户详情",
  //       component: () =>
  //         import(/* webpackChunkName: "page" */ "@/views/user/user/koldetails")
  //     }
  //   ]
  // },
  {
    path: "/business",
    component: Layout,
    redirect: "/business/compile",
    children: [{
      path: "compile",
      name: "新增/编辑商家",
      component: () =>
        import( /* webpackChunkName: "page" */ "@/views/business/compile.vue"),
    }, ],
  },
  {
    path: "/business",
    component: Layout,
    redirect: "/business/store/compile",
    children: [{
      path: "store/compile/:id",
      name: "修改店铺",
      component: () => import("@/views/business/store/compile.vue"),
    }, ],
  },
  {
    path: "/business",
    component: Layout,
    redirect: "/business/store/inctease",
    children: [{
      path: "store/inctease",
      name: "新增店铺",
      component: () => import("@/views/business/store/inctease.vue"),
      meta: {
        keepAlive: true,
        isAuth: false,
      },
    }, ],
  },
  // 修改店铺草稿
  {
    path: "/business",
    component: Layout,
    redirect: "/business/store/draft",
    children: [{
      path: "store/draft/:id",
      name: "修改店铺详情",
      component: () => import("@/views/business/store/draft.vue"),
      meta: {
        keepAlive: true,
        isAuth: false,
      },
    }, ],
  },
  {
    path: "/coupon",
    component: Layout,
    redirect: "/coupon/details",
    children: [{
      path: "details/:couponId",
      name: "查看优惠券",
      component: () => import("@/views/coupon/details"),
    }, ],
  },
  {
    path: "/coupon",
    component: Layout,
    redirect: "/coupon/addcoupon",
    children: [{
      path: "addcoupon",
      name: "添加优惠券",
      component: () => import("@/views/coupon/addcoupon"),
    }, ],
  },
  {
    path: "/coupon",
    component: Layout,
    redirect: "/coupon/editCoupon",
    children: [{
      path: "editCoupon/:couponId",
      name: "编辑优惠券",
      component: () => import("@/views/coupon/editCoupon"),
    }, ],
  },
  {
    path: "/distribution",
    component: Layout,
    redirect: "/distribution/details",
    children: [{
      path: "details/:userId(\\d+)",
      name: "创客详情",
      component: () => import("@/views/distribution/details"),
      meta: {
        title: "详情",
        noCache: true,
        activeMenu: "/distribution/details",
      },
      hidden: true,
    }, ],
  },
  {
    path: "/distribution",
    component: Layout,
    redirect: "/business/makers/compile",
    children: [{
      path: "makers/compile/:id",
      name: "查看/编辑创客",
      component: () => import("@/views/distribution/makers/compile.vue"),
    }, ],
  },
  {
    path: "/distribution",
    component: Layout,
    redirect: "/distribution/makers/establish",
    children: [{
      path: "makers/establish",
      name: "新增创客",
      component: () => import("@/views/distribution/makers/establish.vue"),
    }, ],
  },
  {
    path: "/feeds",
    component: Layout,
    redirect: "/feeds",
    children: [{
        name: "发布图文动态",
        path: "/feeds/issue/image",
        component: () => import("@/views/feeds/issuedby"),
        meta: {
          keepAlive: true,
          isAuth: false,
        },
      },
      {
        name: "发布视频动态",
        path: "/feeds/issue/video",
        component: () => import("@/views/feeds/postvideos"),
        meta: {
          keepAlive: true,
          isAuth: false,
        },
      },
    ],
  },
  {
    path: "/hipro",
    component: Layout,
    redirect: "/hipro/hipro/compile",
    children: [{
      path: "lists/compile",
      name: "查看/编辑嗨PRO卡",
      component: () => import("@/views/hipro/lists/compile.vue"),
    }, ],
  },
  {
    path: "/hipro",
    component: Layout,
    redirect: "/hipro/lists/establish",
    children: [{
      path: "lists/establish",
      name: "新增嗨PRO卡",
      component: () => import("@/views/hipro/lists/establish.vue"),
    }, ],
  },
  {
    path: "/hipro",
    component: Layout,
    redirect: "/hipro/lists/details",
    children: [{
      path: "lists/details/:id",
      name: "嗨PRO卡详情",
      component: () => import("@/views/hipro/lists/details.vue"),
    }, ],
  },
  {
    path: "/circle",
    component: Layout,
    redirect: "/circle/details",
    children: [{
      path: "details/:id",
      name: "圈子详情",
      component: () => import("@/views/circle/details.vue"),
    }, ],
  },
  {
    path: "/task",
    component: Layout,
    redirect: "/task/compile",
    children: [{
      path: "compile",
      name: "新增任务",
      component: () => import("@/views/task/compile.vue"),
      meta: {
        keepAlive: true,
        isAuth: false,
      },
    }, ],
  },
  {
    path: "/task",
    component: Layout,
    redirect: "/task/details",
    children: [{
      path: "details/:id",
      name: "任务详情",
      component: () => import("@/views/task/details.vue"),
    }, ],
  },
  {
    path: "/task",
    component: Layout,
    redirect: "/task/establish",
    children: [{
      path: "establish/:id",
      name: "修改任务",
      component: () => import("@/views/task/establish.vue"),
    }, ],
  },
  {
    path: "/commerce",
    component: Layout,
    redirect: "/commerce/addCommerce",
    children: [{
      path: "addCommerce",
      name: "新增商圈",
      component: () => import("@/views/commerce/addCommerce.vue"),
      meta: {
        keepAlive: true,
        isAuth: false,
      },
    }, ],
  },
  {
    path: "/commerce",
    component: Layout,
    redirect: "/commerce/editCommerce",
    children: [{
      path: "editCommerce",
      name: "编辑商圈",
      component: () => import("@/views/commerce/editCommerce.vue"),
    }, ],
  },
  {
    path: "/commerce/",
    component: Layout,
    redirect: "/commerce/detailCommerce",
    children: [{
      path: "detailCommerce",
      name: "商圈详情",
      component: () => import("@/views/commerce/detailCommerce.vue"),
    }, ],
  },
  {
    path: "/mechanism/",
    component: Layout,
    redirect: "/mechanism/detail",
    children: [{
      path: "detail",
      name: "机构详情",
      component: () => import("@/views/mechanism/detail.vue"),
    }, ],
  },
  {
    path: "/task/",
    component: Layout,
    redirect: "/task/examine",
    children: [{
      path: "examine/:id",
      name: "任务审核",
      component: () => import("@/views/task/examine.vue"),
    }, ],
  },
  // 账户余额提现设置
  {
    path: "/finance/",
    component: Layout,
    redirect: "/finance/withdrawal-set/account-set",
    children: [{
      path: "/finance/withdrawal-set/account-set",
      name: "账户余额提现设置",
      component: () =>
        import("@/views/finance/withdrawal-set/account-set.vue"),
    }, ],
  },
  // 保证金提现设置
  {
    path: "/finance/",
    component: Layout,
    redirect: "/finance/withdrawal-set/bond-set",
    children: [{
      path: "/finance/withdrawal-set/bond-set",
      name: "保证金提现设置",
      component: () => import("@/views/finance/withdrawal-set/bond-set.vue"),
    }, ],
  },
  // 米粒提现设置
  {
    path: "/finance/",
    component: Layout,
    children: [{
      path: "/finance/rice-grain-set",
      name: "米粒提现设置",
      component: () =>
        import("@/views/finance/withdrawal-set/rice-grain-set.vue"),
    }, ],
  },
  {
    path: "/address/",
    component: Layout,
    redirect: "/address/user/detail",
    children: [{
      path: "/address/user/detail",
      name: "用户地址详情",
      component: () => import("@/views/address/user/detail.vue"),
    }, ],
  },
  {
    path: "/address/",
    component: Layout,
    redirect: "/address/shop/detail",
    children: [{
      path: "/address/shop/detail",
      name: "店铺地址详情",
      component: () => import("@/views/address/shop/detail.vue"),
    }, ],
  },
  {
    path: "/order/",
    component: Layout,
    redirect: "/order/material/detail",
    children: [{
        path: "/order/material/detail/:id",
        name: "实物订单详情",
        component: () => import("@/views/order/material/detail.vue"),
      },
      {
        path: "/order/mention/detail/:id",
        name: "自提订单详情",
        component: () => import("@/views/order/mention/detail.vue"),
      },
    ],
  },
  {
    path: "/business/",
    component: Layout,
    redirect: "/business/stock/detail",
    children: [{
      path: "/business/stock/detail",
      name: "库存详情",
      component: () => import("@/views/business/stock/detail.vue"),
    }, ],
  },
  {
    path: "/business/",
    component: Layout,
    redirect: "/business/store/detail",
    children: [{
      path: "/business/store/detail",
      name: "店铺详情",
      component: () => import("@/views/business/store/detail.vue"),
    }, ],
  },
  {
    path: "/business/",
    component: Layout,
    redirect: "/business/store/auditDetails",
    children: [{
      path: "/business/store/auditDetails",
      name: "店铺审核",
      component: () => import("@/views/business/store/auditDetails.vue"),
    }, ],
  },
  // 编辑商品
  {
    path: "/wares",
    component: Layout,
    redirect: "/wares/wares/compile",
    children: [{
      path: "compile/:id",
      name: "编辑商品",
      component: () => import("@/views/wares/wares/compile.vue"),
    }, ],
  },
  // 查看商品
  {
    path: "/wares",
    component: Layout,
    redirect: "/wares/wares/details",
    children: [{
      path: "details/:id",
      name: "商品详情",
      component: () => import("@/views/wares/wares/details.vue"),
    }, ],
  },
  // 新增商品
  {
    path: "/wares",
    component: Layout,
    redirect: "/wares/wares/establish",
    children: [{
      path: "establish",
      name: "新增商品",
      component: () => import("@/views/wares/wares/establish.vue"),
      meta: {
        keepAlive: true,
        isAuth: false,
      },
    }, ],
  },
  // 退款详情
  {
    path: "/refund",
    component: Layout,
    redirect: "/refund/detail",
    children: [{
      path: "detail",
      name: "退款详情",
      component: () => import("@/views/refund/detail.vue"),
    }, ],
  },
  // 退款审核
  {
    path: "/refund",
    component: Layout,
    redirect: "/refund/examine",
    children: [{
      path: "examine",
      name: "退款审核",
      component: () => import("@/views/refund/examine.vue"),
    }, ],
  },
  // 会员卡详情
  {
    path: "/vipCard",
    component: Layout,
    redirect: "/vipCard/details",
    children: [{
      path: "details",
      name: "会员卡详情",
      component: () => import("@/views/vipCard/details.vue"),
    }, ],
  },
  // 新增会员卡
  {
    path: "/vipCard",
    component: Layout,
    redirect: "/vipCard/compline",
    children: [{
      path: "compline",
      name: "新增会员卡",
      component: () => import("@/views/vipCard/compline.vue"),
    }, ],
  },
  // 编辑会员卡
  {
    path: "/vipCard",
    component: Layout,
    redirect: "/vipCard/establish",
    children: [{
      path: "establish",
      name: "编辑会员卡",
      component: () => import("@/views/vipCard/establish.vue"),
    }, ],
  }, // 编辑会员卡
  {
    path: "/business",
    component: Layout,
    redirect: "/business/store/product",
    children: [{
      path: "product/:id",
      name: "修改店铺商品信息",
      component: () => import("@/views/business/store/product.vue"),
    }, ],
  },
  // {
  //   path: '/operate',
  //   component: Layout,
  //   redirect: '/operate/market',
  //   children: [
  //     {
  //       path: 'gift',
  //       name: '新人礼',
  //       component: () =>
  //         import('@/views/operate/market/gift.vue')
  //     }
  //   ]
  // },
  {
    path: "/operate",
    component: Layout,
    redirect: "/operate/market/gift",
    children: [{
      path: "gift/establish",
      name: "新增新人礼",
      component: () => import("@/views/operate/market/gift-establish.vue"),
    }, ],
  },
  {
    path: "/operate",
    component: Layout,
    redirect: "/operate/market/gift",
    children: [{
      path: "gift/compile/:id",
      name: "编辑新人礼",
      component: () => import("@/views/operate/market/gift-compile.vue"),
    }, ],
  },
  {
    path: "/operate",
    component: Layout,
    redirect: "/operate/market",
    children: [{
      path: "gift/details/:id",
      name: "新人礼详情",
      meta: {
        title: "Edit Article",
        noCache: true,
        activeMenu: "/operate/market/gift",
      },
      hidden: true,
      component: () => import("@/views/operate/market/gift-details.vue"),
    }, ],
  },
  {
    path: "/operate",
    component: Layout,
    redirect: "/operate/market/turntable",
    children: [{
      path: "turn/establish",
      name: "新增幸运大抽奖",
      component: () => import("@/views/operate/market/turn-establish.vue"),
    }, ],
  },
  {
    path: "/operate",
    component: Layout,
    redirect: "/operate/market/turntable",
    children: [{
      path: "turn/compile/:id",
      name: "编辑抽奖活动",
      component: () => import("@/views/operate/market/turn-compile.vue"),
    }, ],
  },
  {
    path: "/operate",
    component: Layout,
    redirect: "/operate/market/turntable",
    children: [{
      path: "turn/details/:id",
      name: "抽奖详情",
      meta: {
        title: "Edit Article",
        noCache: true,
        activeMenu: "/operate/market/turn",
      },
      hidden: true,
      component: () => import("@/views/operate/market/turn-details.vue"),
    }, ],
  },
  {
    path: "/operate",
    component: Layout,
    redirect: "/operate/discount/detail",
    children: [{
      path: "/operate/discount/detail/:id",
      name: "满减/满折活动详情",
      component: () => import("@/views/operate/discount/detail"),
    }, ],
  },
  {
    path: "/operate",
    component: Layout,
    redirect: "/operate/discount/establish",
    children: [{
      path: "/operate/discount/establish",
      name: "新增满减/满折活动",
      component: () => import("@/views/operate/discount/establish"),
    }, ],
  },
  {
    path: "/operate",
    component: Layout,
    redirect: "/operate/discount/compile",
    children: [{
      path: "/operate/discount/compile/:id",
      name: "编辑满减/满折活动",
      component: () => import("@/views/operate/discount/compile"),
    }, ],
  },
  {
    path: "/content",
    component: Layout,
    redirect: "/content/special/compile",
    children: [{
        path: "special/compile",
        name: "新增专题",
        hidden: true,
        component: () => import("@/views/content/special/compile.vue"),
      },
      {
        path: "special/preView",
        name: "专题预览",
        hidden: true,
        component: () => import("@/views/content/special/preView.vue"),
      },
    ],
  },
  {
    path: "/content",
    component: Layout,
    redirect: "/content/special/details",
    children: [{
      path: "special/details/:id",
      name: "专题详情",
      hidden: true,
      component: () => import("@/views/content/special/details.vue"),
    }, ],
  },
  {
    path: "/content",
    component: Layout,
    redirect: "/content/special/edit",
    children: [{
      path: "special/edit/:id",
      name: "编辑专题",
      hidden: true,
      component: () => import("@/views/content/special/edit.vue"),
    }, ],
  },
  {
    path: "/content",
    component: Layout,
    redirect: "/content/advert/detail",
    children: [{
      path: "/advert/detail",
      name: "广告详情",
      component: () => import("@/views/content/advert/detail.vue"),
    }, ],
  },
  {
    path: "/content",
    component: Layout,
    redirect: "/content/advert/establish",
    children: [{
      path: "/advert/establish",
      name: "添加广告",
      component: () => import("@/views/content/advert/establish.vue"),
    }, ],
  },
  {
    path: "/content",
    component: Layout,
    redirect: "/advert/compile",
    children: [{
      path: "/content/advert/compile",
      name: "编辑广告",
      component: () => import("@/views/content/advert/compile.vue"),
    }, ],
  },
  // 原因详情
  {
    path: "/detail",
    component: Layout,
    redirect: "/reason/detail",
    children: [{
      path: "/reason/detail",
      name: "原因详情",
      component: () => import("@/views/reason/detail.vue"),
    }, ],
  },
  // 银行端详情
  {
    path: "/staff/detail",
    component: Layout,
    redirect: "/bankers/detail",
    children: [{
      path: "/staff/detail",
      name: "员工详情",
      component: () => import("@/views/bankers/staff/detail.vue"),
    }, ],
  },
  {
    path: "/staff/add",
    component: Layout,
    redirect: "/staff/add",
    children: [{
      path: "/staff/add",
      name: "添加员工",
      component: () => import("@/views/bankers/staff/add.vue"),
    }, ],
  },
  {
    path: "/staff/edit",
    component: Layout,
    redirect: "/bankers/edit",
    children: [{
      path: "/staff/edit",
      name: "编辑员工",
      component: () => import("@/views/bankers/staff/edit.vue"),
    }, ],
  },
  // 查看单位详情
  {
    path: "/mechanism/see",
    component: Layout,
    redirect: "/mechanism/see",
    children: [{
      path: "/mechanism/see",
      name: "单位详情",
      component: () => import("@/views/mechanism/see"),
    }, ],
  },
  //添加公会
  {
    path: "/guild/add",
    component: Layout,
    redirect: "/guild/add",
    children: [{
      path: "/guild/add",
      name: "添加公会",
      component: () => import("@/views/guild/add.vue"),
    }, ],
  },
  //公会详情
  {
    path: "/guild/detail",
    component: Layout,
    redirect: "/guild/detail",
    children: [{
      path: "/guild/detail",
      name: "公会详情",
      component: () => import("@/views/guild/detail.vue"),
    }, ],
  },
  //编辑公会
  {
    path: "/guild",
    component: Layout,
    redirect: "/guild/edit/:id",
    children: [{
      path: "/guild/edit/:id",
      name: "编辑公会",
      component: () => import("@/views/guild/edit.vue"),
    }, ],
  },
  //会员详情
  {
    path: "/member",
    component: Layout,
    redirect: "/member/detail/:id",
    children: [{
      path: "/member/detail/:id",
      name: "会员详情",
      component: () => import("@/views/guild/member-detail.vue"),
    }, ],
  },
];
