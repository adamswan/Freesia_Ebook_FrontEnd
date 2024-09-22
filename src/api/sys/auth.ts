import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetAuthList = 'auth',
  AddNewAuth = 'auth',
  EditAuth = 'auth',
  DeleteAuth = 'auth',

  AddRoleLinkedMenu = 'role/linkedMenu',
  UpdateRoleLinkedMenu = 'role/linkedMenu/update',
  GetListRoleLinkedMenu = 'role/linkedMenu/list',
  DeletAlreadyExist = 'role/linkedMenu',
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

export function deletAlreadyExist(id) {
  return defHttp.delete({ url: `${Api.DeletAlreadyExist}/${id}` });
}

export function addRoleLinkedMenu(roleID, menuID) {
  return defHttp.post({ url: `${Api.AddRoleLinkedMenu}?roleID=${roleID}&menuID=${menuID}` });
}

export function editRoleLinkedMenu(roleID, menuID) {
  return defHttp.post({ url: `${Api.UpdateRoleLinkedMenu}?roleID=${roleID}&menuID=${menuID}` });
}

export function getRoleLinkedMenuList(id) {
  return defHttp.get({ url: `${Api.GetListRoleLinkedMenu}/${id}` });
}
