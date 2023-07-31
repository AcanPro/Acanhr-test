import request from '@/utils/request'

/**
 * 请求部门列表
 * @returns
 */
export function getDepartment() {
  return request({
    url: '/company/department',
    method: 'get'
  })
}

export function getManagerList() {
  return request({
    url: '/sys/user/simple',
    method: 'get'
  })
}

export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

