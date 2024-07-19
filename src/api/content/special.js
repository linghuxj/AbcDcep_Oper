import request from "@/router/axios";

// <sop_goods_topic_30: 专题列表>>分页查询专题信息列表
export function getGoodsTopicPage(query) {
  return request({
    url: "/ope/topic/page",
    method: "get",
    params: query,
  });
}

// <sop_goods_topic_31:查询专题状态列表>查询专题状态列表
export function getGoodsTopicStatus() {
  return request({
    url: "/ope/topic/status",
    method: "get",
  });
}

// topic_11:结束专题>结束专题-修改专题的状态，需要权限'topic_status'
export function postGoodsToppicOver(topicId) {
  return request({
    url: `/ope/topic/over/${topicId}`,
    method: "post",
  });
}

// topic_10: 新增、修改专题>新增或修改的专题相关信息，需要权限'topic_add'
export function postGoodsToppic(data) {
  return request({
    url: `/ope/topic`,
    method: "post",
    data: data,
  });
}

// topic_43:专题、栏目已关联商品>分页查询专题、栏目已关联的商品信息列表
export function getGoodsToppicRelationSelect(query) {
  return request({
    url: `/ope/topic/relation/select`,
    method: "get",
    params: query,
  });
}

// <topic_41:有效的专题列表>查询（未开始和进行中状态）的全部专题信息列表
export function topicList() {
  return request({
    url: `/ope/topic/list`,
    method: "get",
  });
}

// sop_goods_topic_34: 专题页面详情>根据不同专题ID，获取专题的页面详情数据
export function getTopicDetailById(topicId) {
  return request({
    url: `/ope/topic/${topicId}`,
    method: "get",
  });
}

// topic_44:获取专题栏目关联产品的规格列表>根据产品ID获取产品的所有规格商品的库存列表
export function getTopicDetailRelation(data) {
  return request({
    url: `/ope/topic/detail/page`,
    method: "get",
    params: data,
  });
}

// topic_15:关联商品栏内排序>专题关联的商品-栏内排序操作，鼠标离开则自动保存，需要权限'topic_sort'
export function toSortTopic(obj) {
  return request({
    url: `/ope/topic/relation/sort`,
    method: "post",
    data: obj,
  });
}

// <topic_14:取消关联商品>专题关联的商品-进行取消关联操作，支持多选，需要权限'topic_cancel'
export function toCacnelRelationTopic(obj) {
  return request({
    url: `/ope/topic/relation/cancel`,
    method: "post",
    data: obj,
  });
}

// topic_44:获取专题栏目关联产品的规格列表>根据产品ID获取产品的所有规格商品的库存列表
export function getTopicSkuList(query) {
  return request({
    url: `/ope/topic/sku/list`,
    method: "get",
    params: query,
  });
}

// topic_12: 修改专题栏目关联商品规格>修改专题、栏目关联的商品的所选规格信息，需要权限'topic_sku_update'
export function upTopicSku(data) {
  return request({
    url: `/ope/topic/update/sku`,
    method: "post",
    data: data,
  });
}
