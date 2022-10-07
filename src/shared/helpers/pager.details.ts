export const getPager = (query: any) => {
  return {
    page: Number(query.page) - 1 || 0,
    pageSize: Number(query.pageSize) || 100,
  };
};
