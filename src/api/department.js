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
