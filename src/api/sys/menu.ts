import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/getMenuList',
  GetAllMenu = 'menu',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

// 获取当前用户所拥有的所有菜单权限
export const getAllMenu = () => {
  return defHttp.get({ url: Api.GetAllMenu });
};
