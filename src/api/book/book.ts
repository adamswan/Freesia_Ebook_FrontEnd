import { SearchBook } from '/#/book';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetBookList = 'book',
}

export const getBookList = (query: SearchBook) => {
  return defHttp.get({
    url: Api.GetBookList,
    params: query,
  });
};
