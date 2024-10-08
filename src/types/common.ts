export type IPlainObject = {
  [key: string]: any;
};

export type CustomOptions = Omit<RequestInit, "method"> & {
  baseUrl?: string | undefined;
};
