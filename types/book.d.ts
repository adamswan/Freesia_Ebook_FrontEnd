export interface SearchBook {
  page: number;
  pageSize: number;
  name?: string;
  author?: string;
}

export interface BookList {
  [propName: string]: any;
}
