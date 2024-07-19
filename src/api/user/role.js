import request from '@/router/axios'

// <role_40:列表>分页查询角色
export function fetchPage(query) {
  return request({
    url: '/ope/role/page',
    method: 'get',
    params: query
  })
}

// <role_41:列表>查询所有平台角色列表
export function deptRoleList() {
  return request({
    url: '/ope/role/all',
    method: 'get'
  })
}

// <role_42:查询>根据ID查询角色
export function getObj(roleId) {
  return request({
    url: `/ope/role/${roleId}`,
    method: 'get'
  })
}

// <role_10:新增>新增角色，需要权限'role_add'
export function addObj(data) {
  return request({
    url: '/ope/role',
    method: 'post',
    data
  })
}

// <role_11:修改>修改角色，需要权限'role_edit'
export function postObj(data) {
  return request({
    url: '/ope/role/update',
    method: 'post',
    data
  })
}

// <role_13:删除>删除角色，需要权限'role_del'
export function delObj(roleId) {
  return request({
    url: `/ope/role/${roleId}`,
    method: 'delete'
  })
}

// <role_12:修改>更新角色的菜单权限
export function permissionUpd(roleId, menuIds) {
  return request({
    url: '/ope/role/menu',
    method: 'post',
    data: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

// 以下为非新版接口
export function getOrgRole() {
  return request({
    url: '/ope/role/kol/admin',
    method: 'get'
  })
}

export function roleList() {
  return request({
    url: '/ope/role/roleList',
    method: 'get'
  })
}

export function fetchRoleTree(roleId) {
  return request({
    url: '/ope/menu/role/' + roleId,
    method: 'get'
  })
}

export function trans(obj) {
  return request({
    url: '/ope/role/trans',
    method: 'post',
    data: obj
  })
}

export function transGet(obj) {
  return request({
    url: '/ope/role/trans/get',
    method: 'get',
    params: obj
  })
}
