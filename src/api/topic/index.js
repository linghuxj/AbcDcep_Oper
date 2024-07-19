import request from '@/router/axios'
// <tag_40:列表>按条件分页查询所有标签信息列表
export function tagPage(params) {
  return request({
    url: '/ope/tag/page',
    method: 'get',
    params
  })
}

// <tag_10:新增>创建标签，需要权限'tag_add'
export function addTag(data) {
  return request({
    url: '/ope/tag',
    method: 'post',
    data
  })
}
