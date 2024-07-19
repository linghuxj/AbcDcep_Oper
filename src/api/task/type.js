import request from '@/router/axios'

// <task_73:查询任务类型列表>查询任务类型列表
export function getTaskTypeAll() {
  return request({
    url: '/ope/task/types',
    method: 'get'
  })
}

// <task_73:查询任务类型列表>查询任务类型列表
export function getTaskSubTypeAll() {
  return request({
    url: '/ope/task/types?parentType=inspection',
    method: 'get'
  })
}

// <sop_task_50:列表>分页查询任务类型信息列表
export function getTaskTypePage(query) {
  return request({
    url: '/ope/task/type/page',
    method: 'get',
    params: query
  })
}

// <sop_task_20:修改>修改任务类型信息，需要权限'task_type_edit'
export function upTaskType(obj) {
  return request({
    url: '/ope/task/type/update',
    method: 'post',
    data: obj
  })
}
