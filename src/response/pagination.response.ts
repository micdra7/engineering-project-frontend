export class PaginationResponse<T> {
  data: T[] = [];
  meta = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 10,
    itemCount: 10,
  };
}
