import request from "@/router/axios";

// <consume_40:优惠买单信息列表>分页查询优惠买单信息列表
export function getConsumeActivityPage(params) {
  return request({
    url: '/ope/consume/page',
    method: 'get',
    params
  })
}

// coupon_70: 状态字典 > 查询优惠买单活动状态列表;
export function getConsumeStatus(params) {
  return request({
    url: "/ope/consume/status/types",
    method: "get",
    params,
  });
}

// consume_41:根据ID查询>根据活动ID查询优惠买单活动信息
export function detailActivity(actId) {
  return request({
    url: `/ope/consume/${actId}`,
    method: "get",
  });
}

// consume_10:新增>新增优惠买单活动，需要权限'consume_add'
export function addActivity(data) {
  return request({
    url: "/ope/consume",
    method: "post",
    data,
  });
}

// consume_11:修改>修改优惠买单活动，需要权限'consume_edit'
export function updateActivity(data) {
  return request({
    url: "/ope/consume/update",
    method: "post",
    data,
  });
}

// <consume_42:未关联店铺列表>分页查询优惠买单未关联店铺列表
export function getStoreConsumeList(params) {
  return request({
    url: '/ope/consume/not/relation/store/page',
    method: 'get',
    params
  })
}

// <consume_12:结束>根据ID结束活动优惠买单活动，需要权限'consume_finish'
export function closeActivity(actId) {
  return request({
    url: `/ope/consume/finish/${actId}`,
    method: 'post'
  })
}

// <pop_hot_goods_40:爆款商品列表>分页查询爆款商品列表
export function getHotGoodsList(params) {
  return request({
    url: `/pds/hot/goods/activity/page`,
    method: "get",
    params,
  });
}

// <pop_hot_goods_10:新增爆款商品>新增爆款商品，需要权限'hot_goods_activity_add'
export function addHotGood(data) {
  return request({
    url: `/pds/hot/goods/activity`,
    method: "post",
    data,
  });
}

// <pop_hot_goods_11:修改爆款商品>修改爆款商品，需要权限'hot_goods_activity_edit'
export function updateHotGood(data) {
  return request({
    url: `/pds/hot/goods/activity/update`,
    method: "post",
    data,
  });
}

// <sop_product_32:爆款商品未关联列表>分页查询爆款商品未关联列表
export function getHotProductList(params) {
  return request({
    url: `/pds/product/hot/goods/page`,
    method: "get",
    params,
  });
}

// <sop_goods_31:查询商品信息根据productId>根据产品ID获取所有规格商品信息,包括详细信息
export function getGoodsList(productId) {
  return request({
    url: `/pds/goods/list/${productId}`,
    method: "get",
  });
}

// <pop_hot_goods_12:结束爆款商品活动>根据ID结束活动，需要权限'hot_goods_activity_finish'
export function closeHotActivity(actId) {
  return request({
    url: `/pds/hot/goods/activity/finish/${actId}`,
    method: "post",
  });
}

// <pop_hot_goods_45:根据ID查询>根据ID查询爆款商品活动信息
export function detailHotActivity(actId) {
  return request({
    url: `/pds/hot/goods/activity/${actId}`,
    method: "get",
  });
}

// <pop_hot_goods_44:列表>查询星期类型
export function getHotWeek() {
  return request({
    url: `/pds/hot/goods/activity/week`,
    method: "get",
  });
}
