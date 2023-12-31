import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'get'
  })
}

export function alterPassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}
// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
