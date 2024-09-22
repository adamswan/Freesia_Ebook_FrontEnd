import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetRolelIST = 'role',
  AddNewRole = 'role',
  DeleteRole = 'role',
  EditRole = 'role',
  AddRoleLinkedMenu = 'role/linkedMenu',
  UpdateRoleLinkedMenu = 'role/linkedMenu/update',
  UpdateRoleLinkedAuth = 'role/linkedAuth/update',
  GetListRoleLinkedMenu = 'role/linkedMenu/list',
  GetRoleLinkedAuthList = 'auth/linkedAuth/list',
  DeletAlreadyExist = 'role/linkedMenu',
  DeletAlreadyExist_RoleAuth = 'role/linkedAuth',
  GetAuthByRole = 'role/getAuthByRole',
}

export function GetAuthByRole(oData) {
  return defHttp.post({ url: Api.GetAuthByRole, data: oData });
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

export function deletAlreadyExist_RoleMenu(id) {
  return defHttp.delete({ url: `${Api.DeletAlreadyExist}/${id}` });
}
export function deletAlreadyExist_RoleAuth(id) {
  return defHttp.delete({ url: `${Api.DeletAlreadyExist_RoleAuth}/${id}` });
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

export function updateRoleLinkedAuth(roleID, menuID) {
  return defHttp.post({ url: `${Api.UpdateRoleLinkedAuth}?roleID=${roleID}&menuID=${menuID}` });
}

export function getRoleLinkedMenuList(id) {
  return defHttp.get({ url: `${Api.GetListRoleLinkedMenu}/${id}` });
}

export function getRoleLinkedAuthList(id) {
  return defHttp.get({
    url: `${Api.GetRoleLinkedAuthList}`,
    params: {
      roleId: id,
    },
  });
}
