import request from '@/router/axios'
// <district_10:新增商圈>新增商圈信息，需要权限'business_district_add'
export function addDistrict(obj) {
  return request({
    url: '/ope/business/district',
    method: 'post',
    data: obj
  })
}

//sop_district_11:修改商圈>根据ID修改商圈信息，需要权限'business_district_edit'
export function updateDistrict(obj) {
  return request({
    url: '/ope/business/district/update',
    method: 'post',
    data: obj
  })
}

//<sop_business_30:分页查询>分页查询正常状态的商圈信息列表
export function getNormalBusiness(obj) {
  return request({
    url: '/ope/business/district/normal/page',
    method: 'get',
    params: obj
  })
}

// sop_business_31:分页查询>分页查询已下架状态的商圈信息列表
export function getDisabledBusiness(obj) {
  return request({
    url: '/ope/business/district/disabled/page',
    method: 'get',
    params: obj
  })
}

// <sop_district_33:查询详情信息>根据ID查询商圈详情信息（更多详情使用）
export function detailBusiness(businessDistrictId) {
  return request({
    url: `/ope/business/district/detail/${businessDistrictId}`,
    method: 'get'
  })
}

// sop_business_35:查询关联的圈子>根据ID查询关联的圈子列表
export function getDistrictCircle(obj) {
  return request({
    url: '/ope/business/district/circle/page',
    method: 'get',
    params: obj
  })
}

//sop_business_43:查询圈子展示状态>根据商圈ID查询当前展示的圈子名称
export function getBusinessDistrictId(obj) {
  return request({
    url: `/ope/business/district/circle/show/status/${obj.businessDistrictId}`,
    method: 'post',
    data: obj
  })
}

// sop_business_37:查询关联门店列表>分页查询已关联的门店列表
export function getRelationBusiness(obj) {
  return request({
    url: `/ope/business/district/relation/store/page`,
    method: 'get',
    params: obj
  })
}

// sop_business_38:查询未关联门店列表>分页查询未关联的门店列表
export function getNotRelationBusiness(obj) {
  return request({
    url: `/ope/business/district/not/relation/store/page`,
    method: 'get',
    params: obj
  })
}

// sop_business_18:取消关联门店>取消关联门店-可传多个ID，需要权限'business_district_store_edit'
export function cancleRelationStore(Ids) {
  return request({
    url: `/ope/business/district/cancel/relation/store/${Ids}`,
    method: 'delete'
  })
}

// sop_business_17:关联门店>关联门店，需要权限'business_district_store_edit'
export function toRelationStore(obj) {
  return request({
    url: `/ope/business/district/relation/store`,
    method: 'post',
    data: obj
  })
}

// sop_business_19:关联圈子>关联圈子，需要权限'business_district_circle_edit'
export function toRelationCircle(obj) {
  return request({
    url: `/ope/business/district/relation/circle`,
    method: 'post',
    data: obj
  })
}

// sop_business_20:取消关联圈子>取消关联圈子-可传多个ID，需要权限'business_district_circle_edit'
export function deleteRelationCircle(obj) {
  return request({
    url: `/ope/business/district/cancel/relation/circle/${obj.relationBusinessDistrictCircleIds}`,
    method: 'DELETE'
  })
}

// sop_business_40:查询关联圈子列表>分页查询已关联的圈子列表
export function getRelationCircle(obj) {
  return request({
    url: `/ope/business/district/relation/circle/page`,
    method: 'get',
    params: obj
  })
}

// sop_business_41:查询未关联圈子列表>分页查询未关联的圈子列表
export function getNotRelationCircle(obj) {
  return request({
    url: `/ope/business/district/not/relation/circle/page`,
    method: 'get',
    params: obj
  })
}

// district_53:查询圈子已关联和未关联数量>查询商圈的圈子已关联和未关联数量
export function getCountRelationCircle(obj) {
  return request({
    url: `/ope/business/district/relation/circle/count/${obj}`,
    method: 'get'
  })
}

//sop_business_39:查询门店已关联和未关联数量>新增关联门店-已关联和未关联数量
export function getCountRelationStore(obj) {
  return request({
    url: `/ope/business/district/relation/store/count/${obj}`,
    method: 'get'
  })
}

// sop_business_15:下架商圈>根据ID设置商圈下架，需要权限'business_district_status_edit'
export function downBusinessCircle(obj) {
  return request({
    url: `/ope/business/district/disabled/${obj}`,
    method: 'post',
    data: obj
  })
}

// sop_business_14:上架商圈>根据ID设置商圈上架，需要权限'business_district_status_edit'
export function upBusinessCircle(obj) {
  return request({
    url: `/ope/business/district/normal/${obj}`,
    method: 'post',
    data: obj
  })
}

// <district_13:不展示商圈>根据ID修改商圈不展示，需要权限'business_district_show_edit'
export function notShowBusiness(districtId) {
  return request({
    url: `/ope/business/district/hide/${districtId}`,
    method: 'post'
  })
}

// <sop_business_12:展示商圈>根据ID修改商圈展示，需要权限'business_district_show_edit'
export function showBusiness(districtId) {
  return request({
    url: `/ope/business/district/show/${districtId}`,
    method: 'post'
  })
}

// sop_business_36:查询商圈排序>查询商圈排序列表，排序规则为1开始
export function businessSortList() {
  return request({
    url: `/ope/business/district/sort/list`,
    method: 'get'
  })
}

// sop_district_16:修改商圈排序>修改商圈排序，需要权限'business_district_sort_edit'
export function updateBusinessSortList(obj) {
  return request({
    url: `/ope/business/district/update/sort`,
    method: 'post',
    data: obj
  })
}
// <district_54:商圈列表>查询商圈列表(选择商圈使用)
export function getDistrictList(data) {
  return request({
    url: `/ope/business/district/list`,
    method: 'get',
    params: data
  })
}

// sop_area_56:列表>查询所有省,市,区
export function getAreaList(params) {
  return request({
    url: '/ope/area/tree',
    method: 'get',
    params
  })
}

// district_hot_47:商圈列表>查询商圈未关联列表(首页指南-商圈指南-本地热门等)
export function getByCityCode(data) {
  return request({
    url: `/ope/business/district/hot/no/relation/page`,
    method: 'get',
    params: data
  })
}

//<sop_district_hot_30:商圈指南>分页查询商圈指南列表
export function getBusinessGuide(params) {
  return request({
    url: '/ope/business/district/hot/guide/page',
    method: 'get',
    params
  })
}

// <sop_district_hot_31:全网商圈热榜>分页查询商圈指南列表
export function getBusinessDistrictHot(params) {
  return request({
    url: '/ope/business/district/hot/whole/network/page',
    method: 'get',
    params
  })
}

// sop_area_54:列表>根据关键字搜索地区列表
export function getAreaLists(params) {
  return request({
    url: `/ope/area/list`,
    method: 'get',
    params
  })
}

// <sop_district_hot_10: 关联热门商圈/门店>不同类型的热门设置，进行关联商圈/门店操作，需要权限'store_product_add'
export function hotRelation(data) {
  return request({
    url: `/ope/business/district/hot/relation`,
    method: 'post',
    data
  })
}

// <sop_district_hot_34:详情列表接口>查询商圈指南/本地热门商圈/网红打卡地的详情列表
export function getHotDetail(params) {
  return request({
    url: '/ope/business/district/hot/detail/list',
    method: 'get',
    params
  })
}

// <sop_district_hot_10: 取消关联热门商圈/门店>取消关联商圈/门店操作，需要权限'district_hot_cancel_relation'
export function cancelRelation(id) {
  return request({
    url: `/ope/business/district/hot/cancel/relation/${id}`,
    method: 'delete'
  })
}

// <sop_district_hot_32:本地热门商圈>分页查询商圈指南列表
export function getHotCityList(params) {
  return request({
    url: '/ope/business/district/hot/city/page',
    method: 'get',
    params
  })
}

// <district_21:设置商圈展示>设置商圈内是否展示圈子，需要权限'business_district_circle_show_edit'
export function circleShow(id) {
  return request({
    url: `/ope/business/district/circle/show/${id}`,
    method: 'post'
  })
}
