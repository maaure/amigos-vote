export type ErrorResponse = { message?: string };

export type Response<T> = {
  message: string;
  data: T;
};
