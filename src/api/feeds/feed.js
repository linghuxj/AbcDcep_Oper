import request from "@/router/axios";

// note_10:发布图文内容>发布图文内容，需要权限'note_image_add'
export function addImageObj(obj) {
  return request({
    url: "/ope/note/create/image",
    method: "post",
    data: obj,
  });
}

// <21002-创建>发布视频内容，需要权限'note_video_add'
export function addVideoObj(obj) {
  return request({
    url: "/cts/note/create/video",
    method: "post",
    data: obj,
  });
}

// note_40:视频内容列表>分页查询视频内容信息列表
export function getVideos(query) {
  return request({
    url: "/ope/note/page/video",
    method: "get",
    params: query,
  });
}
// <note_42:图文内容列表>分页查询图文内容信息列表
export function getImages(query) {
  return request({
    url: "/ope/note/page/image",
    method: "get",
    params: query,
  });
}

// note_43:下架的图文内容列表>分页查询下架的图文内容信息列表
export function getOffImages(query) {
  return request({
    url: "/ope/note/page/image/off",
    method: "get",
    params: query,
  });
}

// note_41:下架的视频内容列表>分页查询下架视频内容信息列表
export function getOffVideos(query) {
  return request({
    url: "/ope/note/page/video/off",
    method: "get",
    params: query,
  });
}

// note_15:下架动态内容>图文-视频内容下架-提交原因并下架，需要权限'note_off'
export function changeStatus(obj) {
  return request({
    url: "/ope/note/off/status",
    method: "post",
    params: obj,
  });
}

// note_46:动态内容下架原因>根据内容ID，查询动态内容的下架原因
export function getOffStatus(noteId) {
  return request({
    url: `/ope/note/off/reason/${noteId}`,
    method: "post",
  });
}

// <cop_comment_10:新增>新增内容评论信息
export function postCtsCommend(data) {
  return request({
    url: "/ope/comment",
    method: "post",
    data: data,
  });
}

// export function postObj(obj) {
//   return request({
//     url: '',
//     method: 'post',
//     data: obj
//   })
// }

// export function delById(id) {
//   return request({
//     url: '',
//     method: 'delete'
//   })
// }

export function getFeeds(query) {
  return request({
    url: '/cts/note/page',
    method: 'get',
    params: query
  })
}

// export function feedRecommend(feedId) {
//   return request({
//     url: '',
//     method: 'post'
//   })
// }
