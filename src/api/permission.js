import request from '@/utils/request'

export function getPermissionList() {
  return request({
    url: '/sys/permission'
  })
}

export function addPermission(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

export function getPermissionDetail(id) {
  return request({
    url: `/sys/permission/${id}`
  })
}

export function updatePermission(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

export function deletePermission(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}
