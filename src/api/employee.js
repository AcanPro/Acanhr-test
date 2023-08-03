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

