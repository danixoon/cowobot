import axios, { AxiosResponse } from "axios";
import { store } from "../redux/store";

export const servicesFetch = async () => {
  const token = window.localStorage.getItem("token");
  return (
    await axios.get("/api/services", {
      headers: token ? { Authorization: token } : undefined,
    })
  ).data;
};

export const configIdsFetch = async (serviceId: number) => {
  const token = window.localStorage.getItem("token");
  return (
    await axios.get("/api/service/configs", {
      params: { serviceId },
      headers: token ? { Authorization: token } : undefined,
    })
  ).data;
};

export const configFetch = async (configId: number) => {
  const token = window.localStorage.getItem("token");
  return (
    await axios.get("/api/service/config", {
      params: { configId },
      headers: token ? { Authorization: token } : undefined,
    })
  ).data;
};

export const configCreate = async (serviceId: number) => {
  const token = window.localStorage.getItem("token");
  return (
    await axios.post("/api/service/config", undefined, {
      params: { serviceId },
      headers: token ? { Authorization: token } : undefined,
    })
  ).data;
};

export const configDelete = async (configId: number) => {
  const token = window.localStorage.getItem("token");
  return (
    await axios.delete("/api/service/config", {
      params: { configId },
      headers: token ? { Authorization: token } : undefined,
    })
  ).data;
};
