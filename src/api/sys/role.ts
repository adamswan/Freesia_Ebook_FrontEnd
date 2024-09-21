import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetRolelIST = 'role',
  AddNewRole = 'role',
  DeleteRole = 'role',
  EditRole = 'role',
  AddRoleLinkedMenu = 'role/linkedMenu',
  UpdateRoleLinkedMenu = 'role/linkedMenu/update',
  GetListRoleLinkedMenu = 'role/linkedMenu/list',
  DeletAlreadyExist = 'role/linkedMenu',
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

export function deletAlreadyExist(id) {
  return defHttp.delete({ url: `${Api.DeletAlreadyExist}/${id}` });
}

export function editRole(id, oData) {
  return defHttp.post({ url: `${Api.EditRole}/${id}`, data: oData });
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
