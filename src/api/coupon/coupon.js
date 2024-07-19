import request from "@/router/axios";

// coupon_41:列表>分页查询优惠券信息列表
export function pageCoupons(query) {
  return request({
    url: "/ope/coupon/page",
    method: "get",
    params: query,
  });
}

//coupon_70:状态字典>查询优惠券状态类型列表
export function getStates() {
  return request({
    url: "/ope/coupon/status/types",
    method: "get",
  });
}

// coupon_40:查询>根据优惠券ID查询优惠券详细信息
export function getCouponDetailById(couponId) {
  return request({
    url: `/ope/coupon/${couponId}`,
    method: "get",
  });
}

// coupon_72:领取字典>查询优惠券领取方式
export function getTypes() {
  return request({
    url: "/ope/coupon/receive/type/types",
    method: "get",
  });
}

// coupon_43:累计数据>查询优惠券的累计数据
export function getStatisticsData(couponId) {
  return request({
    url: `/ope/coupon/statistic/${couponId}`,
    method: "get",
  });
}

// coupon_42:领取用户列表>分页查询用户领取的优惠券列表信息
export function pageGotCoupon(query) {
  return request({
    url: "/ope/coupon/user/page",
    method: "get",
    params: query,
  });
}

//<coupon_13:修改>状态修改
export function updateCouponStatus(obj) {
  return request({
    url: "/ope/coupon/status",
    method: "post",
    data: obj,
  });
}

// coupon_12:修改>增发优惠券，需要权限'coupon_quota'
export function increaseCoupon(obj) {
  return request({
    url: "/ope/coupon/update/quota",
    method: "post",
    data: obj,
  });
}

// coupon_10:新增>新增优惠券信息，需要权限'coupon_add'
export function addCoupon(obj) {
  return request({
    url: "/ope/coupon",
    method: "post",
    data: obj,
  });
}

// coupon_11:修改>修改优惠券信息，需要权限'coupon_edit'
export function editCoupon(obj) {
  return request({
    url: "/ope/coupon/update",
    method: "post",
    data: obj,
  });
}

// coupon_71:平台字典>查询优惠券发放平台类型列表
export function getCouponPlatform() {
  return request({
    url: "/ope/coupon/platform/types",
    method: "get",
  });
}

// discount_74:关联类型列表>查询优惠券关联类型列表
export function getTypesRelation() {
  return request({
    url: "/ope/coupon/relation/types",
    method: "get",
  });
}

// coupon_45:查询店铺列表>分页查询活动关联的店铺列表
export function getCouponStorePage(query) {
  return request({
    url: "/ope/coupon/store/page",
    method: "get",
    params: query,
  });
}

// coupon_46:查询商圈列表>分页查询活动关联的商圈列表
export function getCouponDistrictPage(query) {
  return request({
    url: "/ope/coupon/district/page",
    method: "get",
    params: query,
  });
}

// coupon_44:查询商品列表>分页查询活动关联的商品列表
export function getCouponGoodsPage(query) {
  return request({
    url: "/ope/coupon/goods/page",
    method: "get",
    params: query,
  });
}