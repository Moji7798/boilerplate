import axios from "axios";
import { toast } from "react-toastify";
import { ERROR, LS, URI, USER } from "../utils/functions";
import {
  API_URL,
  appConstants,
  APP_URL,
  contentTypes,
  statusCodes,
} from "../utils/variables";

const createApi = () => {
  return new Proxy(
    {},
    {
      get(_, key) {
        return async function (props) {
          const {
            method = "get",
            id = null,
            params = {},
            headers = {},
            payload = null,
            tail = "",
            cancelTokenBearer = { current: null },
            showMessageOnError = true,
          } = props || {}; // request props

          const cancelToken = axios.CancelToken.source(); // cancel token
          cancelTokenBearer.current = cancelToken;
          const hasToken = LS.read(appConstants.COVIDENCE_ACCESS_TOKEN);

          const createRequest = () => {
            const token = LS.read(appConstants.COVIDENCE_ACCESS_TOKEN)
              ? `Bearer ${LS.read(appConstants.COVIDENCE_ACCESS_TOKEN)}`
              : ""; // auth token

            const requestHeaders = {
              headers: {
                "Content-Type": contentTypes.json,
                ...headers,
              },
              cancelToken: cancelToken.token,
            };
            if (token) requestHeaders.headers.Authorization = token; // request headers

            const mainRequestUrl = `${API_URL}/api/${key}${
              tail ? "/" + tail : ""
            }${id !== null ? "/" + id : ""}`; // request url

            const requestUrl = URI.addQueryParam(mainRequestUrl, params); // request query params

            const isType1 = method === "get" || method === "delete";

            const firstArg = requestUrl; // axios first arguments

            const secondArg = isType1 ? requestHeaders : payload; // axios second arguments

            const thirdArg = isType1 ? undefined : requestHeaders; // axios third arguments

            return { firstArg, secondArg, thirdArg };
          };

          const sendRequest = async () => {
            try {
              const { firstArg, secondArg, thirdArg } = createRequest();
              const response = await axios[method](
                firstArg,
                secondArg,
                thirdArg
              ); // request response
              return handleResponse(response);
            } catch (err) {
              const { status } = err.response || {};
              const rejectTo = {
                success: false,
                data: null,
                isCancelled: false,
                cancelToken,
                ...err.response,
              };
              if (status === statusCodes.unAuthorized && hasToken) {
                logout();
              }
              if (!axios.isCancel(err) && showMessageOnError) {
                ERROR.show(err.response);
              }
              if (axios.isCancel(err)) {
                rejectTo.isCancelled = true;
              }
              return Promise.reject(rejectTo);
            }
          };

          const handleResponse = (response) => {
            const { status, headers: responseHeaders } = response; // request status

            const isSuccess = status && String(status).startsWith("2"); // check if it's a success

            // handle server messages
            if (!isSuccess && showMessageOnError) ERROR.show(response);
            else toast(response.message, { type: "success" });
            if (status === statusCodes.unAuthorized && hasToken)
              return logout();
            const resolveTo = {
              success: isSuccess,
              headers: responseHeaders,
              cancelToken,
              isCancelled: false,
              ...response,
            };

            return Promise.resolve(resolveTo);
          };

          const logout = () => {
            USER.clear();
            window.location.href = `${APP_URL}/[path-to-login-page]`
          };

          return sendRequest();
        };
      },
    }
  );
};

export const api = createApi();
