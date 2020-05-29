import axios, { AxiosResponse } from "axios";
import { store } from "../redux/store";

export const userLogin = async (username: string, password: string) => {
  const token = window.localStorage.getItem("token");
  return (
    await axios.get("/api/auth", {
      params: { username, password },
      headers: token ? { Authorization: token } : undefined,
    })
  ).data;
};

export const userFetchData = async () => {
  const token = window.localStorage.getItem("token");
  return (
    await axios.get("/api/user", {
      headers: token ? { Authorization: token } : undefined,
    })
  ).data;
};
