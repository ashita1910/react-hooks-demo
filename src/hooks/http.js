import { useCallback, useReducer } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
  clear: () => {},
};

const HttpReducer = (currentHttpState, action) => {
  switch (action?.action) {
    case "SEND":
      return {
        loading: true,
        error: null,
        extra: null,
        identifier: action?.identifier,
      };
    case "RESPONSE":
      return {
        ...currentHttpState,
        loading: false,
        data: action?.responseData,
        extra: action?.extra,
      };
    case "ERROR":
      return { loading: false, error: action?.errorMsg };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("This should not be reached!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(HttpReducer, initialState);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({
        action: "SEND",
        identifier: reqIdentifier,
      });
      fetch(url, {
        method: method,
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res?.json();
        })
        .then((data) => {
          dispatchHttp({
            action: "RESPONSE",
            responseData: data,
            extra: reqExtra,
          });
        })
        .catch((err) => {
          dispatchHttp({
            action: "ERROR",
            errorMsg: "Something went wrong!",
          });
        });
    },
    []
  );

  const clear = useCallback(() => {
    dispatchHttp({
      action: "CLEAR",
    });
  }, []);

  return {
    loading: httpState?.loading,
    error: httpState?.error,
    data: httpState?.data,
    sendRequest: sendRequest,
    extra: httpState?.extra,
    identifier: httpState?.identifier,
    clear: clear,
  };
};

export default useHttp;
