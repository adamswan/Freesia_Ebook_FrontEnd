import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = 'auth/login',
  Logout = '/logout',
  GetUserInfo = 'user/info',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  GetAllUser = 'user',
  AddNewUser = 'user',
  EditNewUser = 'user',
  DeleteUser = 'user',
  Register = 'user/register',
}

export function registerApi(oData) {
  return defHttp.post({
    url: Api.Register,
    data: oData,
  });
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

export async function getAllUserList(queryParams) {
  // 这里的参数，除了page和pageSize外，其余都是 user.data.ts 的 searchFormSchema 对象
  console.log('queryParams', queryParams);
  const res = await defHttp.get({ url: Api.GetAllUser, params: queryParams });
  console.log('res源头', res);
  const newArr = res.map((item) => {
    return {
      ...item,
      active: `${item.active}`,
    };
  });

  return newArr;
}

export function addNewUser(data) {
  return defHttp.post({ url: Api.AddNewUser, data });
}

export function editNewUser(id, data) {
  return defHttp.post({ url: `${Api.AddNewUser}/${id}`, data });
}

export function deleteUser(id) {
  return defHttp.delete({ url: `${Api.DeleteUser}/${id}` });
}
