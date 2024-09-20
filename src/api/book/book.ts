import { SearchBook } from '/#/book';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetBookList = 'book',
  AddBook = 'book',
  DeleteBook = 'book',
  GetOneBook = 'book',
  UpdateOneBook = 'book',
  DownloadBook = 'book',
  AddContents = 'contents',
  DelteContents = 'contents',
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

export const getOneBook = (id: number) => {
  return defHttp.get({
    url: `${Api.GetOneBook}/${id}`,
  });
};

export const addContents = (body) => {
  return defHttp.post({
    url: Api.AddContents,
    data: body,
  });
};

export const delContents = (id) => {
  return defHttp.delete({ url: `${Api.DelteContents}/${id}` });
};

export const updateOneBook = (id, body) => {
  return defHttp.post({
    url: `${Api.UpdateOneBook}/update/${id}`,
    data: body,
  });
};

export const downloadBook = (id: number) => {
  return defHttp.get({
    url: `${Api.DownloadBook}/download/${id}`,
  });
};
