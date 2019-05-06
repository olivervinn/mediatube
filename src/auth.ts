import Vue from "vue";

export default {
  install(vue: any, options = {}) {},

  options() {
    let opts: RequestInit = {
      method: "GET",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        Authorization: localStorage.getItem("token") || ""
      }
    };
    return opts;
  }
};
