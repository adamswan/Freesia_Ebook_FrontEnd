import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/getMenuList',
  GetActiveMenu = 'menu/active',
  CreateMenu = 'menu',
  UpdateMenu = 'menu',
  DeleteMenu = 'menu',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

// 获取当前用户所拥有的所有菜单权限
export const getActiveMenu = () => {
  return defHttp.get({ url: Api.GetActiveMenu });
};

// 创建新菜单
export const createMenu = (data) => {
  return defHttp.post({ url: Api.CreateMenu, data });
};

// 修改菜单
export const UpdateMenu = (id, data) => {
  return defHttp.put({ url: `${Api.UpdateMenu}/${id}`, data });
};

// 删除菜单
export const DeleteMenu = (id) => {
  return defHttp.delete({ url: `${Api.DeleteMenu}/${id}` });
};
