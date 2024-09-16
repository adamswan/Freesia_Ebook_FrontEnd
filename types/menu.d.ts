export interface ToTreeItem {
  id: number;
  pid: number;
  name: string;
  path: string;
  [propName: string]: any;
}

export interface CommonTree {
  [propName: string]: any;
}
