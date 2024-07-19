import request from '@/router/axios'

// <dict_40:列表>分页查询字典列表
export function fetchList (query) {
  return request({
    url: '/ope/dict/page',
    method: 'get',
    params: query
  })
}

// <dict_43:列表>分页查询字典项
export function fetchItemList(query) {
  return request({
    url: '/ope/dict/item/page',
    method: 'get',
    params: query
  })
}

// <dict_13:新增>新增字典项，需要权限dict_item_add
export function addItemObj(obj) {
  return request({
    url: '/ope/dict/item',
    method: 'post',
    data: obj
  })
}

// <dict_44:查询>根据ID查询字典项
export function getItemObj(id) {
  return request({
    url: '/ope/dict/item/' + id,
    method: 'get'
  })
}

// <dict_15:删除>删除字典项，需要权限dict_item_del
export function delItemObj(id) {
  return request({
    url: '/ope/dict/item/' + id,
    method: 'delete'
  })
}

// <dict_14:修改>修改字典项，需要权限dict_item_edit
export function updateItemObj(obj) {
  return request({
    url: '/ope/dict/item/update',
    method: 'post',
    data: obj
  })
}

// <dict_10:新增>新增字典，需要权限dict_add
export function addObj(obj) {
  return request({
    url: '/ope/dict',
    method: 'post',
    data: obj
  })
}

// <dict_41:查询>根据ID查询字典
export function getObj(id) {
  return request({
    url: '/ope/dict/' + id,
    method: 'get'
  })
}

// <dict_12:新增>删除字典，需要权限dict_del
export function delObj(row) {
  return request({
    url: '/ope/dict/' + row.dictId,
    method: 'delete'
  })
}

// <dict_11:修改>修改字典，需要权限dict_edit
export function updateObj(obj) {
  return request({
    url: '/ope/dict/update',
    method: 'post',
    data: obj
  })
}

// <dict_45:列表>根据字典类型查询字典项列表
export function remote(type) {
  return request({
    url: '/ope/dict/type/' + type,
    method: 'get'
  })
}

// <dict_42:校验>判断是否已存在对应字典类型
export function hasDictType(type) {
  return request({
    url: '/ope/dict/has/' + type,
    method: 'get'
  })
}

// <dict_46:校验>查询字典类型下是否存在该字典项的值
export function hasDictItemType(type, value) {
  return request({
    url: '/ope/dict/item/has',
    method: 'get',
    params: {
      dictType: type,
      itemValue: value
    }
  })
}

export function trans(obj) {
  return request({
    url: '/sys/area/item/trans',
    method: 'post',
    data: obj
  })
}
