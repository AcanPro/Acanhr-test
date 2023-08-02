import request from '@/utils/request'

export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
