import axios, { AxiosResponse } from "axios";
import { store } from "../redux/store";

export const servicesFetch = async () => {
  const token = window.localStorage.getItem("token");
  return (
    await axios.get("/api/service", {
      headers: token ? { Authorization: token } : undefined,
    })
  ).data;
};
