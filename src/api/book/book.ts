import { SearchBook } from '/#/book';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetBookList = 'book',
  AddBook = 'book',
  DeleteBook = 'book',
}

export const getBookList = (query: SearchBook) => {
  return defHttp.get({
    url: Api.GetBookList,
    params: query,
  });
};

export const addBook = (body) => {
  return defHttp.post({
    url: Api.AddBook,
    data: body,
  });
};

export const deleteBook = (id) => {
  return defHttp.delete({ url: `${Api.DeleteBook}/${id}` });
};
