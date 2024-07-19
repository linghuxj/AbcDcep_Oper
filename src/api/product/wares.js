import request from "@/router/axios";

// <sop_product_31: 产品列表>>分页查询其产品信息列表
export function reqProductPage(query) {
  return request({
    url: "/ope/product/page",
    method: "get",
    params: query,
  });
}

// <sop_product_11：上架/下架产品>上架/下架产品，修改产品的状态，需要权限'product_status_edit'
export function upProductStatus(data) {
  return request({
    url: "/ope/product/update/status",
    method: "post",
    data: data,
  });
}

// <sop_product_10: 新增、修改产品>新增或修改商品库的产品相关信息，需要权限'product_add'
export function upProduct(data) {
  return request({
    url: "/ope/product",
    method: "post",
    data: data,
  });
}

// product_11:修改产品>修改的产品相关信息，需要权限'product_edit'
export function editProduct(data) {
  return request({
    url: "/ope/product/update",
    method: "post",
    data: data,
  });
}

// <sop_product_30: 产品详情>根据产品ID查询其详细信息
export function reqProductDetailById(productId) {
  return request({
    url: `/ope/product/detail/${productId}`,
    method: "get",
  });
}
