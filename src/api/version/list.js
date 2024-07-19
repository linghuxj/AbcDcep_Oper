import request from "@/router/axios";
// version_52:下载渠道类型类型>查询下载渠道类型
export function reqChannelTypes(params) {
  return request({
    url: "/ope/app/version/channel/types",
    method: "get",
    params,
  });
}

// version_51:客户端类型>查询客户端类型
export function reqClientTypes(params) {
  return request({
    url: "/ope/app/version/client/types",
    method: "get",
    params,
  });
}

// version_10:创建>创建版本信息
export function createVersion(data) {
  return request({
    url: "/ope/app/version/create",
    method: "post",
    data,
  });
}

// version_40:分页>分页查询版本信息
export function reqVersionPage(params) {
  return request({
    url: "/ope/app/version/page",
    method: "get",
    params,
  });
}

// version_50:平台类型>查询平台类型
export function reqPlatformTypes(params) {
  return request({
    url: "/ope/app/version/platform/types",
    method: "get",
    params,
  });
}

// version_20:删除>根据ID删除版本信息
export function deleteVersion(versionId) {
  return request({
    url: `/ope/app/version/${versionId}`,
    method: "delete",
  });
}
