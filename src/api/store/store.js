import request from "@/router/axios";

// <sop_store_50:分页查询门店列表>分页查询门店信息列表
export function pageStores(query) {
  return request({
    url: "/ope/store/page",
    method: "get",
    params: query,
  });
}

// <sop_store_60:分页查询门店待修改列表>分页查询门店待修改信息列表
export function pageDraftStores(params) {
  return request({
    url: "/ope/store/draft/page",
    method: "get",
    params,
  });
}

// <sop_store_61:根据ID查询店铺修改信息>根据ID查询店铺修改信息
export function findDraftStore(draftId) {
  return request({
    url: `/ope/store/draft/${draftId}`,
    method: "get",
  });
}

// <sop_store_10:新增>新增门店信息，需要权限'store_add'
export function addStore(obj) {
  return request({
    url: "/ope/store",
    method: "post",
    data: obj,
  });
}

// <商户门店管理>根据门店ID查询商户门店基本信息
export function findStore(id) {
  return request({
    url: `/ope/store/${id}`,
    method: "get",
  });
}

// <商户门店管理>修改商户信息，需要权限'store_edit'
export function editStore(obj) {
  return request({
    url: "/ope/store/update",
    method: "post",
    data: obj,
  });
}

// <商户门店管理>查询门店状态类型列表
export function storeStatus() {
  return request({
    url: "/ope/store/status",
    method: "get",
  });
}

// <sap_store_52:列表>获取数字人民币开户行类型
export function getStoreOpenBank() {
  return request({
    url: "/ope/store/open/bank",
    method: "get",
  });
}

// sop_store_21:修改门店状态>修改门店的状态，需要权限'store_status_edit'
export function updateStoreStatus(obj) {
  return request({
    url: "/ope/store/status",
    method: "post",
    data: obj,
  });
}

// <sop_store_22:审核店铺修改信息>审核店铺修改信息，需要权限'store_draft_audit'
export function updateStoreDraft(data) {
  return request({
    url: "/ope/store/draft/audit",
    method: "post",
    data,
  });
}

// sop_store_41:门店基础数据>根据门店ID查询门店基础数据信息
export function getBaseData(query) {
  return request({
    url: "/ope/store/base/data",
    method: "get",
    params: query,
  });
}

// <store_product_31:店铺关联商品>每个店铺可以点击关联商品操作，从商品库中选择所有未关联的（上架且未关联）商品列表
export function getRelationProductList(query) {
  return request({
    url: "/ope/store/product/relation/select",
    method: "get",
    params: query,
  });
}

// sop_store_product_11: 关联商品>店铺关联商品信息，需要权限'store_product_add'
export function toRelationProduct(obj) {
  return request({
    url: "/ope/store/product/relation",
    method: "post",
    data: obj,
  });
}

// sop_store_product_30: 店铺关联产品列表>分页查询店铺关联的产品信息列表
export function getProductPage(query) {
  return request({
    url: "/ope/store/product/page",
    method: "get",
    params: query,
  });
}

// sop_store_product_10：上架/下架产品>上架/下架产品，修改店铺产品的状态，需要权限'store_product_status_edit'
export function updateStatus(obj) {
  return request({
    url: "/ope/store/product/update/status",
    method: "post",
    data: obj,
  });
}

// <store_40:分页查询门店列表>分页查询门店信息列表
export function getStoreSimple(query) {
  return request({
    url: "/ope/store/page",
    method: "get",
    params: query,
  });
}

// store_48:查询门店列表>根据关键字查询门店基本信息列表
export function getStoreSimplePage(params) {
  return request({
    url: "/ope/store/simple/list",
    method: "get",
    params,
  });
}

// store_49:查询门店列表>根据关键字查询门店基本信息列表, 默认正常状态
export function getStorePage(params) {
  return request({
    url: "/ope/store/simple/page",
    method: "get",
    params,
  });
}

//<store_70:列表>查询销售渠道类型
export function getSaleChannel() {
  return request({
    url: "/ope/store/sale/channel/types",
    method: "get",
  });
}
// store_14:新增临时巡检任务>新增临时巡检任务，需要权限'task_inspection_temporary'
export function AddTemporarylTnspectionTask(obj) {
  return request({
    url: "/ope/store/temporary/inspection/task",
    method: "post",
    data: obj,
  });
}
// store_15:新增日常巡检任务>新增日常巡检任务，需要权限'task_inspection_normal'
export function AddNormallTnspectionTask(obj) {
  return request({
    url: "/ope/store/normal/inspection/task",
    method: "post",
    data: obj,
  });
}
// store_74:机具状态列表>查询店铺机具状态列表
export function getMachinesStatus(params) {
  return request({
    url: "/ope/store/machines/status",
    method: "get",
    params,
  });
}
// store_46:分页查询门店待修改列表>分页查询门店待修改信息列表
export function getDraftPage(params) {
  return request({
    url: "/ope/store/draft/page",
    method: "get",
    params,
  });
}
