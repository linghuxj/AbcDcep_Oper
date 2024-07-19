import request from "@/router/axios";

// coupon_type_40:列表>分页查询优惠券类型信息列表
export function pageCouponType(query) {
  return request({
    url: "/ope/coupon/type/page",
    method: "get",
    params: query,
  });
}

// coupon_type_11:修改>修改优惠券类型信息，需要权限'coupon_type_edit'
export function editCouponType(obj) {
  return request({
    url: "/ope/coupon/type/update",
    method: "post",
    data: obj,
  });
}

// coupon_type_10:新增>新增优惠券类型信息，需要权限'coupon_type_add'
export function addCouponType(obj) {
  return request({
    url: "/ope/coupon/type",
    method: "post",
    data: obj,
  });
}
// coupon_type_12：修改>修改优惠券是否启用，需要权限'coupon_enabled_edit'
export function enabledCouponType(obj) {
  return request({
    url: "/ope/coupon/type/update/status",
    method: "post",
    data: obj,
  });
}

// coupon_type_41:渠道类型列表>查询优惠券渠道类型列表
export function pageChannelList(data) {
  return request({
    url: "/ope/coupon/type/channel/list",
    method: "get",
    params: data,
  });
}

// coupon_type_41:列表>查询所有正常状态的优惠券列表
export function allCouponTypes() {
  return request({
    url: "/ope/coupon/type/normal/list",
    method: "get",
  });
}
