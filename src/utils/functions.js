import { toast } from "react-toastify";
import { appConstants, errorMessages } from "./variables";

// utility class for local storage
class LS {
  // reads data from localstorage based on the given key
  static read(key) {
    if (!window) return;
    return JSON.parse(localStorage.getItem(key)) || null;
  }

  // saves data into localstorage based on the given key and value
  static save(key, value) {
    if (!window) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // removes data from localstorage based on the given key
  static remove(key, value) {
    if (!window) return;
    localStorage.removeItem(key);
  }
}

// utility class for uris
export class URI {
  // add given queries to the given uri
  static addQueryParam(url, queries = {}) {
    const myUrl = new URL(url);
    const { pageSize, pageNumber } = queries;
    if (pageSize !== undefined) myUrl.searchParams.append("PageSize", pageSize);
    if (pageNumber !== undefined)
      myUrl.searchParams.append("PageNumber", pageNumber);

    return myUrl;
  }
}

// utility class for user
export class USER {
  // clears user related data from localstorage
  static clear() {
    LS.remove(appConstants.COVIDENCE_ACCESS_TOKEN);
  }
}

// utility class for errors
export class ERROR {
  // shows appropriate error message based on response status
  static show(response) {
    // Error 500
    if (!response || String(response.status).startsWith("5")) {
      toast(response?.data?.message || errorMessages[500], {
        type: "error",
      });
      return;
    }

    // Bad Requests
    toast(
      response?.data?.message ? response.data.message : errorMessages[400],
      {
        type: "error",
      }
    );
  }
}
