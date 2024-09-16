import { asyncRoutes } from '/@/router/routes';
// console.log('asyncRoutes',  JSON.stringify(asyncRoutes))

// 路由名 与 组件路径 的全量映射表
export const Full_Dose_Route_Map = {
  // 路由名: 组件路径
};

// 从 asyncRoutes 递归提取,得到一个 路由名 与 组件路径 的扁平化映射表
function getFromAsyncRoutes(asyncRoutes: any[]) {
  for (let i = 0; i < asyncRoutes.length; i++) {
    if (asyncRoutes[i].children && asyncRoutes[i].children.length > 0) {
      getFromAsyncRoutes(asyncRoutes[i].children);
    }
    Full_Dose_Route_Map[asyncRoutes[i].name] = asyncRoutes[i].component;
  }
}
getFromAsyncRoutes(asyncRoutes);

console.log('扁平关系', Full_Dose_Route_Map);
