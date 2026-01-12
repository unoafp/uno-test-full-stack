export interface PageQuery {
  page: number;
  limit: number;
}

export type PaginationMeta = {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type PaginationResult<T> = {
  data: T[];
  meta: PaginationMeta;
};
