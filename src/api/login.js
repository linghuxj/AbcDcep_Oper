import request from '@/router/axios'
// import qs from 'qs'

const scope = 'server'

export const loginByUsername = (username, password, code, randomStr) => {
  let grant_type = 'pwd'
  // let dataObj = qs.stringify({
  //   username: username,
  //   password: password,
  // })
  let dataObj = {
    username: username,
    password: password
  }

  return request({
    url: '/auth/oauth/login/n',
    headers: {
      isToken: false,
      'TENANT-ID': '1',
      Authorization: 'Basic YWRtaW46YWRtaW4='
    },
    method: 'post',
    params: { randomStr, code, grant_type },
    data: dataObj
  })
}

export const refreshToken = refresh_token => {
  const grant_type = 'refresh_token'
  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'TENANT-ID': '1',
      Authorization: 'Basic YWRtaW46YWRtaW4='
    },
    method: 'post',
    params: { refresh_token, grant_type, scope }
  })
}

export const loginByMobile = (mobile, code) => {
  return request({
    url: '/auth/oauth/login/n',
    headers: {
      isToken: false,
      'TENANT-ID': '1',
      Authorization: 'Basic YWRtaW46YWRtaW4='
    },
    method: 'post',
    params: {
      login: mobile,
      code: code,
      grant_type: 'sms'
    }
  })
}

export const loginBySocial = (state, code) => {
  const grant_type = 'social'
  return request({
    url: '/auth/oauth/login/social',
    headers: {
      isToken: false,
      'TENANT-ID': '1',
      Authorization: 'Basic YWRtaW46YWRtaW4='
    },
    method: 'post',
    params: { login: code, login_type: state, grant_type, user_type: 'user' }
  })
}

export const logout = () => {
  return request({
    url: '/auth/token/logout',
    method: 'delete'
  })
}
