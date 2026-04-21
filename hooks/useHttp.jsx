import { useState } from "react";
import apiClient from "@/utils/apiClient";

function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const sendRequests = (requestConfig, applyData, applyError=() => {}) => {
    setIsLoading(true);
    setError(null);

    const headers = requestConfig.headers ? requestConfig.headers : {};
    const access_token = localStorage.getItem("access_token")

    if (requestConfig.url_info?.is_auth_required && access_token && !headers.authorization)  {
      headers["authorization"] = `Bearer ${access_token}`;
    }

    apiClient({
      url: requestConfig?.url_info?.url,
      method: requestConfig.method ? requestConfig.method : "GET",
      headers: {
        ...headers,
      },
      onDownloadProgress(progressEvent) {
        var percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        setDownloadProgress(percent);
      },
      data: JSON.stringify(requestConfig.data) ? requestConfig.data : null,
      params: requestConfig.params ? requestConfig.params : {},
    })
      .then((res) => res.data)
      .then((data) => {
        applyData(data);
        setIsLoading(false);
        setDownloadProgress(0);
      })
      .catch((err) => {
        applyError(err?.response?.data)
        if (err && err.response && err.response.status === 500) {
          setError({
            non_field_errors: ['Something went wrong. Please try again later.'],
          });
        } else if (err && err.response && err.response.data) {
          setError(err.response.data);
        } else {
          setError({
            non_field_errors: ['Something went wrong. Please try again later.'],
          });
        }
        setIsLoading(false);
        setDownloadProgress(0);
      })
      .finally(() => {
        setIsLoading(false);
      })
  };

  return {
    isLoading,
    error,
    sendRequests,
    downloadProgress,
  };
}

export default useHttp;
