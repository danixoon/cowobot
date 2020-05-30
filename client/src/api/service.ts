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

export const serviceConfigsFetch = async (serviceId: string) => {
  const token = window.localStorage.getItem("token");
  return (
    await axios.get("/api/service/configs", {
      params: { serviceId },
      headers: token ? { Authorization: token } : undefined,
    })
  ).data;
};

export const serviceConfigFetch = async (configId: string) => {
  const token = window.localStorage.getItem("token");
  return (
    await axios.get("/api/service/config", {
      params: { configId },
      headers: token ? { Authorization: token } : undefined,
    })
  ).data;
};
