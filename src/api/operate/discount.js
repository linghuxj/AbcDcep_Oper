import request from "@/router/axios";

// <discount_40:查询列表>分页查询满减满折优惠活动信息列表
export function getDiscountActivityPage(data) {
  return request({
    url: '/ope/discount/page',
    method: 'get',
    params: data
  })
}
// <discount_70:状态类型列表>查询满减满折活动状态类型列表
export function getDiscountActivityState() {
  return request({
    url: '/ope/discount/status/types',
    method: 'get'
  })
}

// <discount_12:结束活动>根据ID结束活动，需要权限'discount_status'
export function finishActivityById(actId) {
  return request({
    url: `/ope/discount/finish/${actId}`,
    method: 'post'
  })
}

// <discount_72:折扣类型列表>查询满减满折活动折扣类型列表
export function getDiscountType() {
  return request({
    url: `/ope/discount/discount/types`,
    method: 'get'
  })
}

// <discount_71:关联类型列表>查询满减满折活动关联类型列表
export function getRelationType() {
  return request({
    url: `/ope/discount/relation/types`,
    method: 'get'
  })
}

// <discount_73:平台类型列表>查询满减满折活动平台类型列表
export function getPlatformType() {
  return request({
    url: `/ope/discount/platform/types`,
    method: 'get'
  })
}

// <discount_41: 活动详情>根据活动ID查询其详细信息
export function getActivityDetailById(id) {
  return request({
    url: `/ope/discount/${id}`,
    method: 'get'
  })
}

// <discount_42:查询商品列表>分页查询活动关联的商品列表
export function getActivityPageSku(query) {
  return request({
    url: `/ope/discount/goods/page`,
    method: 'get',
    params: query
  })
}

// <discount_43:查询店铺列表>分页查询活动关联的店铺列表
export function getActivityPageStore(query) {
  return request({
    url: `/ope/discount/store/page`,
    method: 'get',
    params: query
  })
}

// <discount_44:查询商圈列表>分页查询活动关联的商圈列表
export function getActivityPageBusiness(params) {
  return request({
    url: `/ope/discount/district/page`,
    method: 'get',
    params
  })
}

// <discount_10：新增>新增活动，需要权限'discount_add'
export function addDiscountActivity(data) {
  return request({
    url: `/ope/discount/create`,
    method: 'post',
    data: data
  })
}

// <discount_11:修改活动>根据ID修改活动，需要权限'discount_edit'
export function upDiscountActivity(data) {
  return request({
    url: `/ope/discount/update`,
    method: 'post',
    data
  })
}
