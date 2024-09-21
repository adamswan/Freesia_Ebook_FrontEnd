import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetRolelIST = 'role',
}

export function getRoleList() {
  return defHttp.get({ url: Api.GetRolelIST });
}

// export function doLogout() {
//   return defHttp.get({ url: Api.Logout });
// }

// export function addNewUser(data) {
//   return defHttp.post({ url: Api.AddNewUser, data });
// }

// export function editNewUser(id, data) {
//   return defHttp.post({ url: `${Api.AddNewUser}/${id}`, data });
// }

// export function deleteUser(id) {
//   return defHttp.delete({ url: `${Api.DeleteUser}/${id}` });
// }
