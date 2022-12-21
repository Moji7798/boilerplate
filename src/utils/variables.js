export const appConstants = {
  COVIDENCE_ACCESS_TOKEN: "COVIDENCE_ACCESS_TOKEN",
};

export const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL_DEV
    : process.env.REACT_APP_API_URL_PROD;

export const errorMessages = {
  500: "خطایی رخ داد. لطفا از اتصال اینترنت خود اطمینان حاصل نمایید.",
  400: "مشکلی در ارسال درخواست به وجود آمد.",
};

export const httpMethods = {
  post: "post",
  get: "get",
  put: "put",
  patch: "patch",
  delete: "delete",
};

export const statusCodes = {
  success: 200,
  created: 201,
  updated: 204,
  noContent: 204,
  requireVerification: 432,
  badRequest: 400,
  unAuthorized: 401,
};

export const contentTypes = {
  json: "application/json",
  formData: "multipart/form-data",
};

export const APP_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_CLIENT_URL_DEV
    : process.env.REACT_APP_CLIENT_URL_PROD;
