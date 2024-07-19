import request from '@/router/axios'
// <district_tag_40:查询>根据ID查询商圈标签
export function tagPage(params) {
  return request({
    url: '/ope/district/tag/page',
    method: 'get',
    params
  })
}

// <tag_10:新增>创建标签，需要权限'tag_add'
export function addTag(data) {
  return request({
    url: '/ope/district/tag/create',
    method: 'post',
    data
  })
}

// <district_tag_11:修改>修改商圈标签，需要权限'district_tag_edit'
export function editTag(data) {
  return request({
    url: '/ope/district/tag/update',
    method: 'post',
    data
  })
}

// <district_tag_41:查询>根据ID查询商圈标签
export function getTagDistrict(tagId) {
  return request({
    url: `/ope/district/tag/${tagId}`,
    method: 'get'
  })
}

// <district_tag_42:查询>查询有效的商圈标签
export function getTagAll() {
  return request({
    url: `/ope/district/tag/getAll`,
    method: 'get'
  })
}
