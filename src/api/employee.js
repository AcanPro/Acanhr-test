import request from '@/utils/request'

export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params
  })
}

export function exportEmployee() {
  return request({
    url: '/sys/user/export',
    method: 'get',
    // 设置响应类型
    responseType: 'blob'
  })
}

export function getExportTemplate() {
  return request({
    url: '/sys/user/import/template',
    method: 'get',
    // 设置响应类型
    responseType: 'blob'
  })
}

export function uploadExcel(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data // form-data类型 因为要上传文件类型
  })
}

export function deleteEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

export function getEmployeeDetail(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function updateEmployee(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

export function getEnableRoleList() {
  return request({
    url: '/sys/role/list/enabled'
  })
}

export function assignRole(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}

