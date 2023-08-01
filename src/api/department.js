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

export function getDepartmentDetails(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}

export function updateDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
export function deleteDepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

