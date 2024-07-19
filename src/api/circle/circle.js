import request from '@/router/axios'

// circle_40:列表>根据不同条件检索，分页查询圈子列表
export function getCircleList(query) {
  return request({
    url: '/ope/circle/page',
    method: 'get',
    params: query
  })
}

//circle_11:新增>创建圈子，需要权限'circle_add'
export function addObj(obj) {
  return request({
    url: '/ope/circle',
    method: 'post',
    data: obj
  })
}


// <210013-发布动态关联发布者圈子>后台发布动态，关联发布者创建和加入的圈子信息列表
export function getCirlesByName(query) {
  return request({
    url: '/ope/circle/simple/page',
    method: 'get',
    params: query
  })
}

// store_48:查询门店列表>根据关键字查询门店基本信息列表
export function getStoresByName(query) {
  return request({
    url: '/ope/store/simple/list',
    method: 'get',
    params: query
  })
}

// circle_12:修改>修改圈子，需要权限'circle_edit'
export function updateCircle(obj) {
  return request({
    url: '/ope/circle/update',
    method: 'post',
    data: obj
  })
}

// circle_41:圈子详情>根据圈子ID，查询圈子详细信息
export function getCircleByUserId(circleId) {
  return request({
    url: `/ope/circle/${circleId}`,
    method: 'get'
  })
}

// circle_42:圈子基础数据>根据圈子ID，查询圈子基础数据统计信息
export function getStatisticsDate(circleId) {
  return request({
    url: `/ope/circle/statistics/${circleId}`,
    method: 'get'
  })
}

// circle_43:圈子成员列表>根据圈子ID，分页查询圈子成员信息
export function getUserPage(data) {
  return request({
    url: `/ope/circle/join/user/page`,
    method: 'get',
    params:data
  })
}

// ote_45:圈子动态内容列表>根据圈子ID，分页查询圈子动态内容信息
export function getCirclePage(data) {
  return request({
    url: `/ope/note/page/circle`,
    method: 'get',
    params:data
  })
}

