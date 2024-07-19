import request from "@/router/axios";
// coupon_41:列表>分页查询优惠券-消费券信息列表
export function getCouponList(data) {
  return request({
    url: "/ope/coupon/page",
    method: "get",
    params: data,
  });
}
// coupon_10:新增>新增优惠券-消费券信息，需要权限'coupon_add'
export function addCoupon(obj) {
  return request({
    url: "/ope/coupon/consumption",
    method: "post",
    data: obj,
  });
}
