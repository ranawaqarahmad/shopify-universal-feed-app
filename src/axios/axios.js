import Vue from "vue";
import axios from "axios";
import get from "lodash/get";

import { API_END_POINT } from "@/config/index";

const service = axios.create({
  baseURL: API_END_POINT,
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (res) => {
    const { message , messageType , messageTitle } = res.data;
    if(message){
      Vue.notify({
        group: "global-notification",
        text: message,
        title: messageTitle || "Message" ,
        type: messageType || 'success',
        duration: 5000,
      });
    }
    return res;
  },
  (error) => {
    let errorMsg = get(
      error,
      "response.data.error",
      "Something Went Wrong...!"
    );

    const errorsArr = [
      "JsonWebTokenError: jwt malformed",
      "Error: You are not authorize.",
      "Error: Request failed with status code 401"
    ];

    if (errorsArr.includes(errorMsg)) {
      localStorage.removeItem("token");
    }

    Vue.notify({
      group: "global-notification",
      title: "Server Error",
      text: errorMsg,
      type: "error",
      duration: 5000,
    });
    return Promise.reject(error);
  }
);

export default service;
