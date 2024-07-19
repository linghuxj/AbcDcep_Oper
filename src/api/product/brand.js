import request from '@/router/axios'

// <brand_40：品牌列表>根据搜索条件分页查询品牌信息
export function reqBrandPage(query) {
  return request({
    url: '/ope/brand/page',
    method: 'get',
    params: query
  })
}

// <brand_10：新增>新增品牌信息，需要权限'brand_add'
export function addBrand(data) {
  return request({
    url: '/ope/brand',
    method: 'POST',
    data: data
  })
}

// <brand_11：修改>修改品牌信息，需要权限'brand_edit'
export function upBrand(data) {
  return request({
    url: '/ope/brand/update',
    method: 'POST',
    data: data
  })
}

// <brand_12：修改状态>修改品牌状态，需要权限'brand_status_edit'
export function upBrandStatus(data) {
  return request({
    url: '/ope/brand/update/status',
    method: 'POST',
    data: data
  })
}

// <brand_42：品牌查看>根据品牌名称模糊查找品牌信息
export function reqBrandByName(brandName) {
  return request({
    url: `/ope/brand/detail/${brandName}`,
    method: 'get'
  })
}

// <brand_43：不同类目品牌查询>根据类目ID查询其下品牌列表，如cateId为null则查询所有品牌列表
export function reqBrandById(query) {
  return request({
    url: `/ope/brand/cate`,
    method: 'get',
    params: query
  })
}
