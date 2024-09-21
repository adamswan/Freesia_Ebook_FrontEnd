import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetRolelIST = 'role',
  AddNewRole = 'role',
  DeleteRole = 'role',
  EditRole = 'role',
}

export function getRoleList(params) {
  return defHttp.get({ url: Api.GetRolelIST, params });
}

export function addNewRole(oData) {
  return defHttp.post({ url: Api.GetRolelIST, data: oData });
}

export function deleteRole(id) {
  return defHttp.delete({ url: `${Api.DeleteRole}/${id}` });
}

export function editRole(id, oData) {
  return defHttp.post({ url: `${Api.EditRole}/${id}`, data: oData });
}
