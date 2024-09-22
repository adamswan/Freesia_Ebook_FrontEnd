import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetAuthList = 'auth',
  AddNewAuth = 'auth',
  EditAuth = 'auth',
  DeleteAuth = 'auth',
  AddRoleLinkedAuth = 'auth/linkRoleAndAuth',
}

export function getMyAuthList(params) {
  return defHttp.get({ url: Api.GetAuthList, params });
}

export function addNewAuth(oData) {
  return defHttp.post({ url: Api.AddNewAuth, data: oData });
}

export function editAuth(id, oData) {
  return defHttp.post({ url: `${Api.EditAuth}/${id}`, data: oData });
}

export function deleteAuth(id) {
  return defHttp.delete({ url: `${Api.DeleteAuth}/${id}` });
}

export function addRoleLinkedAuth(roleId, authId) {
  return defHttp.post({ url: `${Api.AddRoleLinkedAuth}?roleId=${roleId}&authId=${authId}` });
}
