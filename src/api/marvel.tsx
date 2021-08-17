import axios from "axios";
import {
  GetComicsResponse,
  GetCharactersResponse,
  GetCharacterComics,
} from "./marvel.d";

export const getComics = (params?: {
  limit?: number;
  skip?: number;
  title?: string;
}) =>
  axios
    .get<GetComicsResponse>("/comics", {
      baseURL: process.env.REACT_APP_API_BASEPATH,
      params,
    })
    .then((response) => response.data);

export const getCharacters = (params?: {
  limit?: number;
  skip?: number;
  name?: string;
}) =>
  axios
    .get<GetCharactersResponse>("/characters", {
      baseURL: process.env.REACT_APP_API_BASEPATH,
      params,
    })
    .then((response) => response.data);

export const getCharacterComics = (id: string) => {
  return axios
    .get<GetCharacterComics>(`/comics/${id}`, {
      baseURL: process.env.REACT_APP_API_BASEPATH,
    })
    .then((response) => response.data);
};
