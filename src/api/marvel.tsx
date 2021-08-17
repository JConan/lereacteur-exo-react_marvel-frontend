import axios from "axios";
import { GetComicsReturn } from "./marvel.d";

export const getComics = (params?: {
  limit: number;
  skip: number;
  title: string;
}) =>
  axios.get<GetComicsReturn>("/comics", {
    baseURL: process.env.REACT_APP_API_BASEPATH,
    params,
  });
