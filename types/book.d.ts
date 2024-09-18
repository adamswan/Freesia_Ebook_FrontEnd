import { FormSchema } from '@/components/Form/src/types/form';

export interface SearchBook {
  page: number;
  pageSize: number;
  name?: string;
  author?: string;
}

export interface BookList {
  [propName: string]: any;
}

export interface UploadAPI extends FormSchema {
  api: any;
}
