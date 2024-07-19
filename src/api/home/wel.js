import request from '@/router/axios'


// <sap_kanban_41:查询>创客转化漏斗
export function getGovBecome() {
  return request({
    url: '/us/data/kanban/become',
    method: 'get'
  })
}

// <sap_kanban_42:查询>累积开通数字人民币用户
export function getGovOpenDcep() {
  return request({
    url: '/us/data/kanban/open/dcep',
    method: 'get'
  })
}

// <sap_kanban_43:查询>性别分布
export function getGovSexRatios() {
  return request({
    url: '/us/data/kanban/sex/ratios',
    method: 'get'
  })
}

// <sap_kanban_40:查询>总况
export function getGovTotalCase() {
  return request({
    url: '/us/data/kanban/total/case',
    method: 'get'
  })
}

// <sap_kanban_44:查询>每小时访问用户数
export function getGovTotalHourUvs() {
  return request({
    url: '/us/data/kanban/hour/uv',
    method: 'get'
  })
}

// <sap_kanban_45:查询>今日商圈数据
export function getGovTotalBusiness() {
  return request({
    url: '/us/data/kanban/business',
    method: 'get'
  })
}

// <sap_kanban_45:查询>长沙市各区数据展示
export function getGovTotalArea() {
  return request({
    url: '/us/data/kanban/area',
    method: 'get'
  })
}
